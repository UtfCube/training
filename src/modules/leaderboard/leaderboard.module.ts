import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';

import { Period } from 'src/entities/period.entity';
import { Training } from 'src/entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, Period])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
