import { Controller, Post, UsePipes, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseService } from './exercise.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('exercise')
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService)
    {}

    @Post('new')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
        await this.exerciseService.create(createExerciseDto);
    }
}
