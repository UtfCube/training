import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PeriodService } from './period.service';
import { User } from 'src/entities/user.entity';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';

@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Get()
  async getActivePeriod(@AuthUser() user: User) {
    return await this.periodService.getActivePeriod(user);
  }

  @Get('/price')
  async getPeriodPrice(@AuthUser() user: User) {
    return await this.periodService.getPrice(user);
  }

  @Post()
  async startPeriod(@AuthUser() user: User, @Body('price') price: number) {
    return await this.periodService.startPeriod(user, price);
  }
}
