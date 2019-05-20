import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../entities/user.entity';
import { Training } from '../../entities/training.entity';
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
        user,
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

  async getById(user: User, id: number) {
    return await this.trainingRepository.findOne({
      id,
      user,
    });
  }

  async create(user: User) {
    const exercises = await this.excersiceService.fullfill();

    const training = this.trainingRepository.create({
      user,
      exercises,
    });

    return await this.trainingRepository.save(training);
  }

  async startTraining(trainingId: number) {
    return await this.trainingRepository.update(trainingId, {
      dateStarted: new Date(),
    });
  }

  async stopTraining(trainingId: number) {
    const training = await this.trainingRepository.findOne(trainingId);

    if (!training) {
      throw new NotFoundException('Training not found');
    }

    const exercises = await training.exercises;

    const score = exercises.reduce((acc, ex) => {
      acc += ex.result;
      return acc;
    }, 0);

    return await this.trainingRepository.update(trainingId, {
      score,
      dateEnded: new Date(),
    });
  }

  async updateScore(training: Training) {
    return await this.trainingRepository.save(training);
  }
}
