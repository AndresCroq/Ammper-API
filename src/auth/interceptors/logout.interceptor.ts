import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { BlacklistedService } from '../services';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  @Inject()
  private readonly blacklistedService: BlacklistedService;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        complete: async () => {
          await this.blacklistedService.clearList();
        },
      }),
    );
  }
}
