export interface IUser {
    readonly nickname: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly email?: string;
    readonly avatar?: string;
    readonly vk_id?: string;
    readonly facebook_id?: string;
}