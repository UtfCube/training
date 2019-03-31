import { Test, TestingModule } from '@nestjs/testing';
import { TrainingController } from './training.controller';

describe('Training Controller', () => {
  let controller: TrainingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
