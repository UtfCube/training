import { Controller, Get, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Controller('history')
export class HistoryController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getTrainings(@Headers('authorization') token: string) {
        const jwt = this.authService.decodeJwt(token.slice(7));
        const user = await this.userService.findById(jwt.sub);
        return user.trainings;
    }
}
