import { IFacebookConfig } from '../interfaces/facebool-config.interface';

export const facebookConfig: IFacebookConfig = {
    clientID: '380046729258322',
    clientSecret: '6db050b4186c83fedf84a57de7471a55',
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    scope: ['profile'],
}