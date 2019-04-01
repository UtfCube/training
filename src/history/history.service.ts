import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Training } from '../entity/training.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(Training)
        private readonly trainingRepository: Repository<Training>,
    ) {}
    
    async getByUserIdPaged(user_id: number, page: number, limit: number) {        
        const {total} = await this.trainingRepository
            .createQueryBuilder('training')
            .select('COUNT(training.id)', 'total')
            .where('training.user = :user_id', {user_id})
            .getRawOne();
        const trainings =  await this.trainingRepository
            .createQueryBuilder('training')
            .leftJoinAndSelect('training.exercises', 'exercises')
            .leftJoinAndSelect('exercises.exercise', 'exercise')
            .where('training.user = :user_id', {user_id})
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return { total: total, history: trainings };
    } 
}
