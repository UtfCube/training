export interface IVKConfig {
  readonly clientID: string;
  readonly clientSecret: string;
  readonly callbackURL: string;
  readonly scope: string[];
  readonly profileFields: string[];
  readonly apiVersion: string;
}