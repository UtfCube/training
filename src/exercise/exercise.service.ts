import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entity/exercise.entity';
import { IExercise } from './interfaces/exercise.interface';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepositoty: Repository<Exercise>
    ) {}

    async create(info: IExercise) {
        const exercise = this.exerciseRepositoty.create(info);
        await this.exerciseRepositoty.save(exercise);
        return exercise;
    }

}
