import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcersiceService } from './excersice.service';
import { ExcersiceController } from './excersice.controller';
import { Exercise } from 'src/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExcersiceController],
  providers: [ExcersiceService],
})
export class ExcersiceModule {}
