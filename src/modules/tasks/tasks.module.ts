import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameTask } from './tasks/game.task';
import { DisqualifyTask } from './tasks/disqualify.task';

import { Training } from 'src/entities/training.entity';

import { PeriodModule } from '../period/period.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

import { PeriodService } from '../period/period.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Module({
  imports: [
    PeriodModule,
    LeaderboardModule,
    TypeOrmModule.forFeature([Training]),
  ],
  providers: [GameTask, DisqualifyTask, PeriodService, LeaderboardService],
})
export class TasksModule {}
