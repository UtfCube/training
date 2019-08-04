import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ParseQueryOptions } from 'src/common/pipes/parse-query-options.pipe';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard() {
    return await this.leaderboardService.getList();
  }
}
