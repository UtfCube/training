import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from 'src/entities/exercise.entity';

@Injectable()
export class ExcersiceService {
  constructor(
    @InjectRepository(Exercise)
    private readonly excersiseRepository: Repository<Exercise>,
  ) {}

  get list() {
<<<<<<< HEAD
    return [{ name: 'Squats', key: 'SQUAT' }];
=======
    return [
      { name: 'Squats', key: 'SQUAT' },
      // { name: 'Exercise X', key: 'EXERCISE_X' },
    ];
>>>>>>> refactoring
  }

  async fullfill(): Promise<Exercise[]> {
    return await this.list.map(entity => {
      return this.excersiseRepository.create({
        ...entity,
        count: Math.floor(Math.random() * 10) + 5,
      });
    });
  }
<<<<<<< HEAD
=======

  async updateResult(trainingId: number, exerciseId: number) {
    try {
      const exercise = await this.excersiseRepository.findOneOrFail({
        id: exerciseId,
        training: {
          id: trainingId,
        },
      });

      exercise.result = exercise.result + 1;

      return await this.excersiseRepository.save(exercise);
    } catch (err) {
      throw err;
    }
  }

  async storeNewFrame(trainingId: number, exerciseId: number, frame: any) {
    try {
      const exercise = await this.excersiseRepository.findOneOrFail({
        id: exerciseId,
        training: {
          id: trainingId,
        },
      });

      if (!exercise.rawFrames) {
        exercise.rawFrames = [];
      }

      exercise.rawFrames.push(JSON.stringify(frame));

      return await this.excersiseRepository.save(exercise);
    } catch (err) {
      throw err;
    }
  }
>>>>>>> refactoring
}
