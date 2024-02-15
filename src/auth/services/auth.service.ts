import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from '../types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateId() {
    return uuid();
  }

  hash(code: string) {
    return bcrypt.hashSync(code, 10);
  }

  compare(password: string, encrypted: string) {
    return bcrypt.compare(password, encrypted);
  }

  generatetAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      if (!error.expiredAt) console.error(error);
    }
  }
}
