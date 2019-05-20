import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { User } from '../../entities/user.entity';

export const AuthUser = createParamDecorator(async (data, req) => {
  if (!req || !req.user || !req.user.sub || !req.user.email) {
    throw new UnauthorizedException();
  }

  const user = await User.findOne({
    oauthId: req.user.sub,
    email: req.user.email,
  });

  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
});
