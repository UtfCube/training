import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-vkontakte";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";
import { IUser } from "src/user/interfaces/user.interface";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService) {
      super(configService.vkConfig);
  }
  
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
        const user_info: IUser = {
            nickname: profile.username,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            avatar: profile.photos.find((x: any) => x.type === 'photo_200_orig').value,
            vk_id: profile.id
        }
          const existingUser = await this.userService.findByVkId(profile.id)
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