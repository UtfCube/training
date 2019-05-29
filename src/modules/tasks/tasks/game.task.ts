import * as Moment from 'moment';
import { Injectable } from '@nestjs/common';
import { PeriodService } from 'src/modules/period/period.service';
import { LeaderboardService } from 'src/modules/leaderboard/leaderboard.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { getConnection } from 'typeorm';

@Injectable()
export class GameTask {
  private job: NodeJS.Timeout;

  constructor(
    private readonly periodService: PeriodService,
    private readonly leaderboardService: LeaderboardService,
  ) {
    let isRunning = false;

    this.job = setInterval(async () => {
      if (isRunning) {
        return;
      }
      isRunning = true;
      await this.run();
      isRunning = false;
    }, 1000);
  }

  async distributeWinnings() {
    const periods = await this.periodService.getMonthPeriods();

    const totalBank = periods.reduce((acc, period) => {
      acc += period.price;
      return acc;
    }, 0);

    const totalLose = periods.reduce((acc, period) => {
      if (period.active === false) {
        acc += period.price;
      }
      return acc;
    }, 0);

    const toDistribution = totalBank - totalLose;
    const multiplier = totalBank / toDistribution;

    const { list } = await this.leaderboardService.getList();

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const winner of list) {
        const winnerActivePeriod = await this.periodService.getActivePeriod(
          winner.user,
        );
        const winning = winnerActivePeriod.price * multiplier;

        winner.user.balance += winning;
        winnerActivePeriod.active = false;

        await queryRunner.manager.save(winner.user);
        await queryRunner.manager.save(winnerActivePeriod);

        console.log(`User ${winner.user.id} wins ${winning}`);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async run() {
    const currentDate = Moment();
    const endOfMonth = Moment().endOf('month');

    const needWork =
      currentDate.date() === endOfMonth.date() &&
      currentDate.hours() === endOfMonth.hours() &&
      currentDate.minutes() === endOfMonth.minutes() &&
      currentDate.seconds() === endOfMonth.seconds();

    if (needWork) {
      await this.distributeWinnings();
    }
  }
}
