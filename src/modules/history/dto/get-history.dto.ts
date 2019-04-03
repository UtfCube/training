import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetHistoryQueryDto {
    @IsNumber()
    @Transform(value => Number(value))
    page: number;

    @IsNumber()
    @Transform(value => Number(value))
    limit: number;
}