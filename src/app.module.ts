import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, RequestMethod } from '@nestjs/common';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';

import { ConfigService } from './modules/config/config.service';

import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from './modules/config/config.module';
import { EventsModule } from './modules/events/events.module';
import { PeriodModule } from './modules/period/period.module';
import { TrainingModule } from './modules/training/training.module';
import { ExcersiceModule } from './modules/excersice/excersice.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    ConfigModule,
    EventsModule,
    PeriodModule,
    TrainingModule,
    ExcersiceModule,
    LeaderboardModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware, AuthenticationMiddleware).forRoutes(
      {
        path: '/users',
        method: RequestMethod.GET,
      },
      {
        path: '/training',
        method: RequestMethod.ALL,
      },
      {
        path: '/period',
        method: RequestMethod.ALL,
      },
      {
        path: '/leaderboard',
        method: RequestMethod.ALL,
      },
    );
  }
}
