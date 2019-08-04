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

const getWeek = function (date: Date, dowOffset: number = 0) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
  
      dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
      let newYear = new Date(date.getFullYear(),0,1);
      let day = newYear.getDay() - dowOffset; //the day of week the year begins on
      day = (day >= 0 ? day : day + 7);
      let daynum = Math.floor((date.getTime() - newYear.getTime() - 
      (date.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
      let weeknum;
      //if the year starts before the middle of a week
      if(day < 4) {
          weeknum = Math.floor((daynum+day-1)/7) + 1;
          if(weeknum > 52) {
              let nYear = new Date(date.getFullYear() + 1,0,1);
              let nday = nYear.getDay() - dowOffset;
              nday = nday >= 0 ? nday : nday + 7;
              /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
              weeknum = nday < 4 ? 1 : 53;
          }
      }
      else {
          weeknum = Math.floor((daynum+day-1)/7);
      }
      return weeknum;
  };

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
    /*
    const startOfMonth = Moment()
      .startOf('month')
      .toDate();
    const endOfMonth = Moment()
      .endOf('month')
      .toDate();
      */
    const startOfWeek = Moment()
      .startOf('week')
      .toDate();
    const endOfWeek = Moment()
      .endOf('week')
      .toDate();
    //const daysInMonth = Moment().daysInMonth();
    const daysInWeek = 7;
    //const currentMonth = new Date().getMonth();
    const currentWeek = getWeek(new Date());

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

      for (let day = 0; day < daysInWeek; day++) {
        const dayResult = userResults.find(res => {
          return (
            getWeek(res.dateStarted) === currentWeek &&
            getWeek(res.dateEnded) === currentWeek &&
            res.dateStarted.getDay() === day &&
            res.dateEnded.getDay() === day
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
