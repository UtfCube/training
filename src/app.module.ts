import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ExerciseModule } from './exercise/exercise.module';
import { TrainingModule } from './training/training.module';
import { HistoryModule } from './history/history.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    ExerciseModule, 
    TrainingModule, 
    HistoryModule, 
    ConfigModule, 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService  
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
