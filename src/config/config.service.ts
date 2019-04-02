import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { validate } from 'joi';
import * as fs from 'fs';
import { IConfig } from './interfaces/config.interface';
import { IFacebookConfig } from './interfaces/facebook-config.interface';
import { IVKConfig } from './interfaces/vk-config.interface';
import { envVarsSchema } from './joi/config.joi';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';


@Injectable()
export class ConfigService implements TypeOrmOptionsFactory {
  private readonly envConfig: IConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: IConfig): IConfig {
    const { error, value: validatedEnvConfig } = validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get facebookConfig(): IFacebookConfig {
    const facebookConfig: IFacebookConfig = {
        clientID: this.envConfig.FACEBOOK_CLIENT_ID,
        clientSecret: this.envConfig.FACEBOOK_CLIENT_SECRET,
        callbackURL: this.envConfig.FACEBOOK_CALLBACK_URL,
        scope: this.envConfig.FACEBOOK_SCOPE.split(' ')
    };
    return facebookConfig;
  }

  get vkConfig(): IVKConfig {
    const vkConfig: IVKConfig = {
        clientID: this.envConfig.VK_CLIENT_ID,
        clientSecret: this.envConfig.VK_CLIENT_SECRET,
        callbackURL: this.envConfig.VK_CALLBACK_URL,
        scope: this.envConfig.VK_SCOPE.split(' '),
        profileFields: this.envConfig.VK_PROFILE_FIELDS.split(' '),
        apiVersion: this.envConfig.VK_API_VER
    };
    return vkConfig;
  }

  get jwtSecretKey(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }

  get wsServerPort(): number {
    return Number(this.envConfig.WS_SERVER_PORT);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: (this.envConfig.DB_TYPE as any),
      host: this.envConfig.DB_HOST,
      port: Number(this.envConfig.DB_PORT),
      username: this.envConfig.DB_USERNAME,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_DATABASE_NAME,
      entities: this.envConfig.DB_ENTITIES.split(' '),
      synchronize: Boolean(this.envConfig.DB_SYNCHRONIZE)
    }
  }
}
