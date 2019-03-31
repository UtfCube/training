import { Controller, Post, UseGuards, Headers, Body, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { TrainingService } from './training.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UserService } from 'src/user/user.service';
import { ExtractJwt } from 'passport-jwt';

@Controller('training')
export class TrainingController {
    constructor(
        private readonly trainingService: TrainingService,
        private readonly authService: AuthService,
        private readonly userService: UserService) {}

    @Post('new')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getTraining(@Headers('authorization') token: string, @Body() createTrainingDto: CreateTrainingDto) {
        const jwt = this.authService.decodeJwt(token.slice(7));
        const user = await this.userService.findById(jwt.sub);
        return await this.trainingService.create(createTrainingDto.exercises, user);
    }
    
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getTrainings(@Headers('authorization') token: string) {
        const jwt = this.authService.decodeJwt(token.slice(7));
        const user = await this.userService.findById(jwt.sub);
        return await this.trainingService.getAll(user);
    }
}
