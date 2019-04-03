import { Controller, Post, Body } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseService } from './exercise.service';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post('new')
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    await this.exerciseService.create(createExerciseDto);
  }
}
