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
    const { format }: { format: string } = context
      .switchToHttp()
      .getRequest().query;

    return next.handle().pipe(
      map((data: Bank[]) => {
        return this.formatterService.format(format, data);
      }),
    );
  }
}
