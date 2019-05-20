import { Controller, Post, Headers, Body } from '@nestjs/common';
import { ExcersiceService } from './excersice.service';

@Controller('excersice')
export class ExcersiceController {
  constructor(private readonly excersiceService: ExcersiceService) {}
}
