import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
//import { AuthService } from '../auth.service';
//import { SERVER_CONFIG } from '../../../server.constants';
import { JWT_SECRET_KEY } from '../config/jwt-config';
import { IUser } from '../../user/interfaces/user.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY
    });
  }

  public async validate(payload: IJwtPayload, done: Function) {
    const user: IUser = await this.userService.findById(payload.sub);
    const exp = new Date(payload.exp * 1000)
    const now = new Date()
    if (!user && now > exp) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}