import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetRefresh = createParamDecorator((_data: string, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user;

  return user;
});
