import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, RequestMethod } from '@nestjs/common';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { AuthenticationMiddleware } from 'src/common/middlewares/authentication.middleware';

import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './modules/config/config.module';
import { ConfigService } from './modules/config/config.service';
import { TrainingModule } from './modules/training/training.module';
import { ExcersiceModule } from './modules/excersice/excersice.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TrainingModule,
    ExcersiceModule,
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
    );
  }
}
