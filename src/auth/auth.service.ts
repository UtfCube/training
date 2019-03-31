import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from './config/jwt-config';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    
    createJwt(id: number): string {
        const token: string = sign({ sub: id }, JWT_SECRET_KEY, { expiresIn: '1h' });
        return token;
    }

    decodeJwt(token: string): IJwtPayload {
        const decodedJwt: IJwtPayload = verify(token, JWT_SECRET_KEY);
        return decodedJwt
    }
}
