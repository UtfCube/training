import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingService } from './training.service';
import { UsersService } from '../users/users.service';
import { TrainingController } from './training.controller';

import { Training } from '../../entities/training.entity';
import { ExcersiceService } from '../excersice/excersice.service';
import { ExcersiceModule } from '../excersice/excersice.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, ExcersiceModule, TypeOrmModule.forFeature([Training])],
  controllers: [TrainingController],
  providers: [UsersService, TrainingService, ExcersiceService],
})
export class TrainingModule {}
