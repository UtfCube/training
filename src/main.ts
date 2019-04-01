import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { fork } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('/api');
  const trainingProcess = fork(__dirname + '/stream/wsserver.ts');
  await app.listen(3000);
}
bootstrap();
