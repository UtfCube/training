import { IsString } from 'class-validator';
import { IExercise } from '../interfaces/exercise.interface';

export class CreateExerciseDto implements IExercise {
  @IsString() readonly name: string;
}
