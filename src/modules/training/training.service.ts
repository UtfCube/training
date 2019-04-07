import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Training } from 'src/entities/training.entity';
import { ExcersiceService } from '../excersice/excersice.service';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
    private readonly excersiceService: ExcersiceService,
  ) {}

  async getHistory(user: User, { limit = 20, page = 1 }) {
    const [trainings, total] = await this.trainingRepository.findAndCount({
      where: {
        user: user,
      },
      order: {
        dateCreated: 'DESC',
      },
      relations: ['exercises'],
      take: limit,
      skip: limit * (page - 1),
    });

    return {
      total,
      trainings,
    };
  }

  async create(user: User) {
    const exercises = await this.excersiceService.fullfill();

    const training = this.trainingRepository.create({
      user,
      exercises,
    });

    return await this.trainingRepository.save(training);
  }
}
