export interface IFacebookConfig {
    readonly clientID: string;
    readonly clientSecret: string;
    readonly callbackURL: string;
    readonly scope: string[];
  }