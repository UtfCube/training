import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    
    @Get('vk')
    @UseGuards(AuthGuard('vk'))
    vkLogin() {}

    @Get('vk/callback')
    @UseGuards(AuthGuard('vk'))
    vkLoginCallback(@Req() req) {
        return req.user;
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    facebookLogin() {}

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    facebookLoginCallback(@Req() req) {
        return req.user;
    }
}
