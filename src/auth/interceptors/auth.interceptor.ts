import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../types';
import refreshExpiration from '../config/refresh-expiration';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data: AuthResponse) => {
        const res = context.switchToHttp().getResponse();

        res.cookie('refresh', data.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: refreshExpiration.asNumber,
        });

        delete data.refreshToken;
        return data;
      }),
    );
  }
}
