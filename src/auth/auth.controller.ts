import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post()
  // create(@Body() createAuthDto: LoginDto) {
  //   return this.authService.create(createAuthDto);
  // }

  @Get('validate')
  auth(@Req() request: Request) {
    return this.authService.validate(request.headers.authorization);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    return data;
  }
}
