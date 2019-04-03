import { Controller, Post, Headers, Body } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('new')
  async getTraining(
    @AuthUser() user: User,
    @Body() createTrainingDto: CreateTrainingDto,
  ) {
    return await this.trainingService.create(createTrainingDto.exercises, user);
  }
}
