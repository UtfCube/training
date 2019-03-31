import { IsString } from 'class-validator';

export class CreateTrainingDto{
    @IsString({
        each: true
    }) 
    readonly exercises: string[];
}