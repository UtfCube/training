import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";
import { IUser } from "src/user/interfaces/user.interface";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService) {
      super(configService.facebookConfig);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
      try {
        const user_info: IUser = {
            nickname: profile.username,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails.shift().value,
            avatar: profile.photos.shift().value,
            facebook_id: profile.id
        }

        const existingUser = await this.userService.findByFacebookId(profile.id);
        if (existingUser) {
            this.userService.updateInfo(existingUser.id, user_info);
            const jwt: string = this.authService.createJwt(existingUser.id);
            return done(null, { access_token: jwt });
        }

        const user = await this.userService.create(user_info);
        const jwt: string = this.authService.createJwt(user.id);
        done(null, { access_token: jwt });
      }
      catch(error) {
          done(error, false);
      }
  }
} 