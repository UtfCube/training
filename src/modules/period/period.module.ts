import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodService } from './period.service';
import { Period } from 'src/entities/period.entity';
import { PeriodController } from './period.controller';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Module({
  imports: [LeaderboardModule, TypeOrmModule.forFeature([Period])],
  controllers: [PeriodController],
  providers: [LeaderboardService, PeriodService],
})
export class PeriodModule {}
