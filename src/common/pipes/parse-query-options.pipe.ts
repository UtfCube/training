import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { QueryOptionsDto } from '../dto/query-options.dto';

@Injectable()
export class ParseQueryOptions implements PipeTransform {
  async transform(options: QueryOptionsDto, metadata: ArgumentMetadata) {
    const result = { ...options };
    const page = parseInt(options.page, 10);
    const limit = parseInt(options.limit, 10);

    if (!isNaN(page) && page >= 1) {
      Object.assign(result, {
        page,
      });
    }
    if (!isNaN(limit) && limit >= 0) {
      Object.assign(result, {
        limit,
      });
    }

    return result;
  }
}
