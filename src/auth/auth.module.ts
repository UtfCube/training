import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './passport/facebook.strategy';
import { VkStrategy } from './passport/vk.strategy';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './passport/jwt.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UserService, FacebookStrategy, VkStrategy, JwtStrategy]
})
export class AuthModule {}
