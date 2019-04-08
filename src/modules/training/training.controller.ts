import {
  Controller,
  Post,
  Headers,
  Body,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { TrainingService } from './training.service';
import { User } from 'src/entities/user.entity';
import { ParseQueryOptions } from 'src/common/pipes/parse-query-options.pipe';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  async getHistory(
    @AuthUser() user: User,
    @Query(new ParseQueryOptions()) options,
  ) {
    return await this.trainingService.getHistory(user, options);
  }

  @Get(':id')
  async getTrainingById(@AuthUser() user: User, @Param('id') id: number) {
    const training = await this.trainingService.getById(user, id);

    if (!training) {
      throw new NotFoundException();
    }

    return training;
  }

  @Post()
  async createNewTraining(@AuthUser() user: User) {
    return await this.trainingService.create(user);
  }
}
