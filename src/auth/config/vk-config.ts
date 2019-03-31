import { IVKConfig } from '../interfaces/vk-config.interface';

export const vkConfig: IVKConfig = {
    clientID: '6920815',
    clientSecret: 'XAoKZhYUY1V9JmcfHrIe',
    callbackURL: 'http://localhost:3000/api/auth/vk/callback',
    scope: ['email'],
    profileFields: ['photo_200_orig'],
    apiVersion: '5.92'
}
