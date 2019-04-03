import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from '../entity/training.entity';
import { History } from '../entity/history.entity';
import { Exercise } from 'src/entities/exercise.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Training, History, Exercise, User])],
  controllers: [TrainingController],
  providers: [UsersService, TrainingService],
})
export class TrainingModule {}
