import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { exceptionHandlerSwitch } from 'src/common/utils';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class OptionalUserGuard extends AuthGuard('optional-user') {
  handleRequest<TUser = User>(_err: any, user: any, info: any): TUser {
    if (_err) {
      const { message, status } = _err;
      exceptionHandlerSwitch(status, message);
    }
    if (!info) return user;
    if (info?.message === 'No auth token') return user;
    throw new UnauthorizedException();
  }
}
