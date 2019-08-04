import * as Moment from 'moment';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  getConnection,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Training } from 'src/entities/training.entity';
import { PeriodService } from 'src/modules/period/period.service';

@Injectable()
export class DisqualifyTask {
  private job: NodeJS.Timeout;

  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
    private readonly periodService: PeriodService,
  ) {
    let isRunning = false;

    this.job = setInterval(async () => {
      if (isRunning) {
        return;
      }
      isRunning = true;
      await this.run();
      isRunning = false;
    }, 10 * 1000);
  }

  async disqualify() {
    const currentDate = Moment();
    const pastTwoDays = Moment().subtract(2, 'days');

    const periods = await this.periodService.getAllActivePeriods();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const period of periods) {
        if (
          Moment(period.dateStarted)
            .add(2, 'days')
            .date() > Moment().date()
        ) {
          continue;
        }

        const activeTrainings = await this.trainingRepository.find({
          score: MoreThan(0),
          userId: period.userId,
          dateEnded: LessThanOrEqual(currentDate),
          dateStarted: MoreThanOrEqual(pastTwoDays),
        });

        if (activeTrainings.length === 0) {
          await this.periodService.stopPeriod(period.user, queryRunner);
          console.log(`Stopped period for user ${period.user.id}`);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async run() {
    await this.disqualify();
  }
}
