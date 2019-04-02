import { Controller, Get, UseGuards, Req, Res, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    
    @Get('vk')
    @UseGuards(AuthGuard('vk'))
    vkLogin() {}

    @Get('vk/callback')
    @UseGuards(AuthGuard('vk'))
    vkLoginCallback(@Req() req) {
        const {access_token} = req.user;
        return req.user;
        /*if (access_token) {
            res.redirect('http://front-root/login/success/' + access_token)
        }
        else {
            res.redirect('http://front-root/login/failure');
        }
        */
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    facebookLogin() {}

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    facebookLoginCallback(@Req() req, @Res() res) {
        const {access_token} = req.user;
        if (access_token) {
            res.redirect('http://front-root/login/success/' + access_token)
        }
        else {
            res.redirect('http://front-root/login/failure');
        }
    }
}
