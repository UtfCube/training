import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findById(id: number) {
        return await this.userRepository.findOne(id);
    }

    async findByVkId(vk_id: string) {
        return await this.userRepository.findOne({vk_id});
    }

    async findByFacebookId(facebook_id: string) {
        return await this.userRepository.findOne({facebook_id});
    }
    async updateInfo(id: number, info: IUser) {
        return await this.userRepository.update(id, info);
    }
    async create(info: IUser) {
        const user = this.userRepository.create(info);
        await this.userRepository.save(user);
        return user;
    }

    //async getHistoryPaged(user: User, page: number, limit: number) {
    //    const 
    //}
}
