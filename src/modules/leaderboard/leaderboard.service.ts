import * as Moment from 'moment';

import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  In,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Training } from 'src/entities/training.entity';
import { Period } from 'src/entities/period.entity';

interface ILeaderboardResult {
  score: number;
  user: User;
}

interface ILeaderboardResultResponse {
  list: ILeaderboardResult[];
  endOfMonth: Date;
  startOfMonth: Date;
  daysInMonth: number;
}

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
  ) {}

  async getList(): Promise<ILeaderboardResultResponse> {
    const startOfMonth = Moment()
      .startOf('month')
      .toDate();
    const endOfMonth = Moment()
      .endOf('month')
      .toDate();
    const daysInMonth = Moment().daysInMonth();
    const currentMonth = new Date().getMonth();

    const periods = await this.periodRepository.find({
      active: true,
    });

    if (periods.length === 0) {
      return {
        list: [],
        startOfMonth,
        endOfMonth,
        daysInMonth,
      };
    }

    const users = periods.map(p => p.userId);

    const results = await this.trainingRepository.find({
      select: ['user', 'dateStarted', 'dateEnded'],
      relations: ['user'],
      where: {
        userId: In(users),
        score: MoreThan(0),
        dateEnded: LessThanOrEqual(endOfMonth),
        dateStarted: MoreThanOrEqual(startOfMonth),
      },
    });

    const activeUsers: { [key: string]: ILeaderboardResult } = results.reduce(
      (acc, result) => {
        if (!acc.hasOwnProperty(result.user.id)) {
          acc[result.user.id] = {
            score: 0,
            user: result.user,
          };
        }
        return acc;
      },
      {},
    );

    const leaderboard = Object.values(activeUsers).map(info => {
      const userResults = results.filter(r => r.user.id === info.user.id);

      for (let day = 1; day <= daysInMonth; day++) {
        const dayResult = userResults.find(res => {
          return (
            res.dateStarted.getMonth() === currentMonth &&
            res.dateEnded.getMonth() === currentMonth &&
            res.dateStarted.getDate() === day &&
            res.dateEnded.getDate() === day
          );
        });

        if (dayResult) {
          info.score++;
        }
      }

      return info;
    });

    return {
      list: leaderboard.sort((a, b) => {
        return b.score - a.score;
      }),
      startOfMonth,
      endOfMonth,
      daysInMonth,
    };
  }
}
