import { IKeypoint } from './keypoint.interface';

export interface IFrame {
    readonly score: number;
    readonly keypoints: IKeypoint[];
}