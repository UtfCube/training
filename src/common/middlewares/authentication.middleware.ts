import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from 'src/modules/config/config.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use() {
    const clientDomain = this.configService.get('AUTH0_CLIENT_DOMAIN');

    return jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${clientDomain}/.well-known/jwks.json`,
      }),
      aud: 'lootmart-api',
      issuer: 'https://' + clientDomain + '/',
      algorithm: 'RS256',
      // credentialsRequired: false
    });
  }
}
