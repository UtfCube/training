import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { IUser } from '../../user/interfaces/user.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService,
    private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecretKey
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