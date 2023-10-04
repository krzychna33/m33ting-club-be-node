import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CognitoAccessTokenCheckGuard,
  RequestWithUser,
} from '../../libs/application/auth/cognito-access-token.guard';
import { QueryBus } from '@nestjs/cqrs';
import { FindUserById } from './queries/find-user-by-id/find-user-by.id';
import { match } from 'oxide.ts';
import { UserNotFoundException } from './user.exceptions';

@UseGuards(CognitoAccessTokenCheckGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    const userResult = await this.queryBus.execute(
      new FindUserById({ userId: req.user.id }),
    );

    return match(userResult, {
      Ok: (user) => {
        return user;
      },
      Err: (err) => {
        if (err instanceof UserNotFoundException) {
          throw new NotFoundException(err.message);
        }
        throw err;
      },
    });
  }
}
