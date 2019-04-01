import { Controller, Get, UseGuards, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
        ) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getInfo(@Headers('authorization') token: string) {
        const jwt = this.authService.decodeJwt(token.slice(7));
        const user = await this.userService.findById(jwt.sub);
        delete user.trainings;
        return user;
    }
}
