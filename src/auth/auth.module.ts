import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService, BlacklistedService, RefreshService } from './services';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy, OptionalJwtStrategy, RefreshTokenStrategy } from './strategies';
import { BlacklistedMongooseModule, RefreshMongooseModule } from './schemas';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '2h' },
        };
      },
    }),
    BlacklistedMongooseModule,
    RefreshMongooseModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    OptionalJwtStrategy,
    BlacklistedService,
    RefreshService,
  ],
  exports: [
    JwtStrategy,
    OptionalJwtStrategy,
    PassportModule,
    JwtModule,
    BlacklistedService,
  ],
})
export class AuthModule {}
