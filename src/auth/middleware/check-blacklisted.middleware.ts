import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';
import { BlacklistedService } from 'src/auth/services';

@Injectable()
export class checkBlacklistedMiddleware implements NestMiddleware {
  constructor(private readonly blacklistedService: BlacklistedService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;

      const blacklisted = await this.blacklistedService.checkBlacklisted(authorization);
      if (blacklisted) throw new UnauthorizedException();

      next();
    } catch (error) {
      if (error?.status !== 401) console.error(error);
      throw new UnauthorizedException();
    }
  }
}
