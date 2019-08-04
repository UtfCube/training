import * as Moment from 'moment';
import {
  Repository,
  QueryRunner,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { Period } from 'src/entities/period.entity';

@Injectable()
export class PeriodService {
  public static periodCost: number = 1000;

  constructor(
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  async getActivePeriod(user: User) {
    return await this.periodRepository.findOne({
      where: {
        active: true,
        user,
      },
    });
  }

  async getPrice(user: User) {
    const daysInWeek = 7;
    const currentDayNum = Moment().isoWeekday();
    const multiplier = (daysInWeek - currentDayNum + 1) / daysInWeek;
    const k = Math.pow(10, 2);
    return Math.ceil(multiplier * PeriodService.periodCost * k) / k;
  }

  async getAllActivePeriods() {
    return await this.periodRepository.find({
      where: {
        active: true,
      },
    });
  }

  async getWeekPeriods() {
    const endOfWeek = Moment().endOf('isoWeek');
    const startOfWeek = Moment().startOf('isoWeek');

    return await this.periodRepository.find({
      where: {
        dateEnded: LessThanOrEqual(endOfWeek),
        dateStarted: MoreThanOrEqual(startOfWeek),
      },
    });
  }

  async startPeriod(user: User, price: number) {
    const activePeriod = await this.getActivePeriod(user);
    const activePrice = await this.getPrice(user);

    if (activePeriod) {
      return activePeriod;
    }

    if (activePrice !== price) {
      throw new BadRequestException(
        'Price has been updated, please reload page',
      );
    }

    const userBalance = await user.balance;

    if (userBalance < activePrice) {
      throw new BadRequestException('Insufficient balance');
    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const period = this.periodRepository.create({
        active: true,
        userId: user.id,
        price: activePrice,
        dateStarted: new Date(),
        expiryDate: Moment().endOf('isoWeek'),
      });

      user.balance = userBalance - activePrice;

      await queryRunner.manager.save(period);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return period;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async stopPeriod(user: User, queryRunner: QueryRunner) {
    const period = await this.getActivePeriod(user);

    if (!period) {
      throw new Error(`Active period not found for user ${user.id}`);
    }

    period.active = false;

    return await queryRunner.manager.save(period);
  }
}
