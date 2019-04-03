import { Controller, Get, Headers, Query } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { GetHistoryQueryDto } from './dto/get-history.dto';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly historyService: HistoryService,
  ) {}

  @Get()
  async getTrainings(
    @Headers('authorization') token: string,
    @Query() query: GetHistoryQueryDto,
  ) {
    const jwt = this.authService.decodeJwt(token.slice(7));
    const res = await this.historyService.getByUserIdPaged(
      jwt.sub,
      query.page,
      query.limit,
    );
    //const user = await this.userService.findById(jwt.sub);
    //const history = user.trainings.slice((query.page - 1) * query.limit, query.page * query.limit);
    return res;
  }
}
