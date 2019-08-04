import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly oauthId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly picture: string;

  @IsEmail()
  readonly email: string;
}
