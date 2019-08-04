import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TrainingModule } from '../training/training.module';
import { TrainingService } from '../training/training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from 'src/entities/training.entity';
import { ExcersiceModule } from '../excersice/excersice.module';
import { ExcersiceService } from '../excersice/excersice.service';

@Module({
  imports: [TrainingModule, ExcersiceModule],
  providers: [TrainingService, ExcersiceService, EventsGateway],
})
export class EventsModule {}
