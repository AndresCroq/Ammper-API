import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Bank } from './schemas/bank.schema';
import { FormatterService } from './formatter.service';

@Injectable()
export class BankInterceptor implements NestInterceptor {
  constructor(private readonly formatterService: FormatterService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const {
      format,
      month,
      flow,
    }: { format: string; month: string; flow: string } = context
      .switchToHttp()
      .getRequest().query;

    return next.handle().pipe(
      map(async ({ count, banks }: { banks: Bank[]; count: number }) => {
        return await this.formatterService.format(
          format,
          banks,
          month,
          flow,
          count,
        );
      }),
    );
  }
}
