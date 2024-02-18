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
    const { format, flow }: { format: string; flow: string } = context
      .switchToHttp()
      .getRequest().query;

    return next.handle().pipe(
      map(({ count, banks }: { banks: Bank[]; count: number }) => {
        return this.formatterService.format(format, banks, flow, count);
      }),
    );
  }
}
