import { IFrame } from './frame.interface';

export interface ITraining {
    readonly user_id: number;
    readonly training_id: number;
    frames: IFrame[];
}