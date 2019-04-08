import * as jwtDecode from 'jwt-decode';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from 'src/modules/config/config.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: Function) {
    if (!req.headers || !req.headers['authorization']) {
      throw new UnauthorizedException();
    }

    try {
      const token = req.headers['authorization'].replace('Bearer ', '');
      const decoded = jwtDecode(token);
      req['user'] = decoded;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }

    next();
  }
}
