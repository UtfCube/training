import { Controller, Get, UseGuards, Headers, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { GetHistoryQueryDto } from './dto/get-history.dto';

@Controller('history')
export class HistoryController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getTrainings(@Headers('authorization') token: string, @Query() query: GetHistoryQueryDto) {
        const jwt = this.authService.decodeJwt(token.slice(7));
        const user = await this.userService.findById(jwt.sub);
        const history = user.trainings.slice((query.page - 1) * query.limit, query.page * query.limit);
        return { total: user.trainings.length, history: history };
    }
}
