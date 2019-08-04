import {
  Controller,
  Put,
  Get,
  Body,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserByToken(@Request() params: any) {
    if (!params.user) {
      throw new BadRequestException();
    }

    const options = {
      ...params.user,
      oauthId: params.user.sub,
    };

    const user = await this.usersService.findUser(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Put()
  async registerUser(@Body() userDto: CreateUserDto) {
    return await this.usersService.upsertUser(userDto);
  }
}
