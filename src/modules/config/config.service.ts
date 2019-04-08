import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`.env`));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.envConfig.DB_TYPE as any,
      host: this.envConfig.DB_HOST,
      port: Number(this.envConfig.DB_PORT),
      username: this.envConfig.DB_USERNAME,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_DATABASE_NAME,
      entities: this.envConfig.DB_ENTITIES.split(' '),
      synchronize: Boolean(this.envConfig.DB_SYNCHRONIZE),
    };
  }
}
