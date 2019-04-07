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
    return [{ name: 'Squats', key: 'SQUAT' }];
  }

  async fullfill(): Promise<Exercise[]> {
    return await this.list.map(entity => {
      return this.excersiseRepository.create({
        ...entity,
        count: Math.floor(Math.random() * 10),
      });
    });
  }
}
