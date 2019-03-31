import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from '../entity/training.entity';
import { History } from '../entity/history.entity';
import { Exercise } from 'src/entity/exercise.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, History, Exercise, User])],
  controllers: [TrainingController],
  providers: [AuthService, UserService, TrainingService]
})
export class TrainingModule {}
