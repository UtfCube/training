import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
    constructor(private readonly configService: ConfigService) {}

    createJwt(id: number): string {
        const token: string = sign({ sub: id }, this.configService.jwtSecretKey, { expiresIn: '1h' });
        return token;
    }

    decodeJwt(token: string): IJwtPayload {
        const decodedJwt: IJwtPayload = Object(verify(token, this.configService.jwtSecretKey));
        return decodedJwt
    }
}
