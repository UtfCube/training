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
  endOfWeek: Date;
  startOfWeek: Date;
  daysInWeek: number;
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
    const startOfWeek = Moment()
      .startOf('isoWeek')
      .toDate();
    const endOfWeek = Moment()
      .endOf('isoWeek')
      .toDate();

    const daysInWeek = 7;

    const periods = await this.periodRepository.find({
      active: true,
    });

    if (periods.length === 0) {
      return {
        list: [],
        startOfWeek,
        endOfWeek,
        daysInWeek,
      };
    }

    const activeUsers: { [key: string]: ILeaderboardResult } = periods.reduce(
      (acc, period) => {
        if (!acc.hasOwnProperty(period.user.id)) {
          acc[period.user.id] = {
            score: 0,
            user: period.user,
          };
        }
        return acc;
      },
      {},
    );

    const users = periods.map(p => p.userId);

    const results = await this.trainingRepository.find({
      select: ['user', 'dateStarted', 'dateEnded'],
      relations: ['user'],
      where: {
        userId: In(users),
        score: MoreThan(0),
        dateEnded: LessThanOrEqual(endOfWeek),
        dateStarted: MoreThanOrEqual(startOfWeek),
      },
    });

    const leaderboard = Object.values(activeUsers).map(info => {
      const userResults = results.filter(r => r.user.id === info.user.id);

      for (let day = 0; day < daysInWeek; day++) {
        const dayResult = userResults.find(res => {
          return (
            res.dateStarted.getDay() === day && res.dateEnded.getDay() === day
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
      startOfWeek,
      endOfWeek,
      daysInWeek,
    };
  }
}
