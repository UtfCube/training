import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
//import { User } from 'src/entities/user.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const model = this.userRepository.create(userDto);
      return await this.userRepository.save(model);
    } catch (err) {
      throw new ConflictException();
    }
  }

  async findUser(userDto: CreateUserDto): Promise<User> {
    return await this.userRepository.findOne({
      oauthId: userDto.oauthId,
      email: userDto.email,
    });
  }

  async upsertUser(userDto: CreateUserDto): Promise<User> {
    let user = await this.findUser(userDto);

    if (!user) {
      user = await this.createUser(userDto);
    }

    return user;
  }
}
