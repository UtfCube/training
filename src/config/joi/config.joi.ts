import { object, number, string, boolean, ObjectSchema } from 'joi';

export const envVarsSchema: ObjectSchema = object({
  FACEBOOK_CLIENT_ID: string().required(),
  FACEBOOK_CLIENT_SECRET: string().required(),
  FACEBOOK_CALLBACK_URL: string().required(),
  FACEBOOK_SCOPE: string().required(),
  VK_CLIENT_ID: string().required(),
  VK_CLIENT_SECRET: string().required(),
  VK_CALLBACK_URL: string().required(),
  VK_SCOPE: string().required(),
  VK_PROFILE_FIELDS: string().required(),
  VK_API_VER: string().default('5.92'),
  JWT_SECRET_KEY: string().required(),
  WS_SERVER_PORT: number().default(3000),
  DB_TYPE: string().required(),
  DB_HOST: string().required(),
  DB_PORT: number().required(),
  DB_USERNAME: string().required(),
  DB_PASSWORD: string().default(''),
  DB_DATABASE_NAME: string().required(),
  DB_ENTITIES: string().required(),
  DB_SYNCHRONIZE: boolean().default(true)
});