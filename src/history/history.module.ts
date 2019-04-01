import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { History } from '../entity/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History, User])],
  controllers: [HistoryController],
  providers: [HistoryService, UserService, AuthService]
})
export class HistoryModule {}
