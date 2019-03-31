import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from '../entity/training.entity';
import { History } from '../entity/history.entity';
import { Exercise } from '../entity/exercise.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class TrainingService {
    constructor(
        @InjectRepository(Training)
        private readonly trainingRepository: Repository<Training>,
        @InjectRepository(History)
        private readonly historyRepository: Repository<History>,
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>
    ) {}

    async getById(id: number) {
        const training = await this.trainingRepository.findOne(id);
        
    }

    async create(exercises: string[], user: User) {
        const training: Training = new Training();
        training.creation_date = new Date();
        training.user = user;
        await this.trainingRepository.save(training);
        for (const name of exercises) {
            const exercise = await this.exerciseRepository.findOne({name});
            const record = new History();
            record.exercise = exercise;
            record.training = training;
            //record.user = user;
            record.repeat_number = Math.floor(Math.random() * (100 - 10)) + 10;
            await this.historyRepository.save(record);
        }
        const tmp = await this.trainingRepository.findOne(training.id);
        return tmp;
    }

    async getAll(user: User) {
        return user.trainings;
    }
}
