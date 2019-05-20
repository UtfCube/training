import { Repository, MoreThanOrEqual, Not, IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Training } from '../../entities/training.entity';
import * as Moment from 'moment';
import { User } from '../../entities/user.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
  ) {}

  async getList() {
    const results = await this.trainingRepository.find({
      select: ['user', 'score'],
      relations: ['user'],
      where: {
        dateCreated: MoreThanOrEqual(Moment().subtract(1, 'month')),
        dateStarted: Not(IsNull()),
        dateEnded: Not(IsNull()),
        score: Not(IsNull()),
      },
    });

    const leaderboard = results.reduce((acc, result) => {
      if (!acc.hasOwnProperty(result.user.id)) {
        acc[result.user.id] = {
          score: 0,
          user: result.user,
        };
      }

      acc[result.user.id].score += result.score;

      return acc;
    }, {});

    const list: { score: number; user: User }[] = Object.values(leaderboard);

    return list.sort((a, b) => {
      return b.score - a.score;
    });
  }
}
