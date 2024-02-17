import { Inject, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcrypt';
import { LoginDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';

import { JwtService } from '@nestjs/jwt';
import { forwardRef } from '@nestjs/common/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createAuthDto: LoginDto) {
    try {
      const { password, ...userData } = createAuthDto;

      await this.userService.create({
        ...userData,
        password: hashSync(password, 12),
      });

      // return { ...user, token: this.setJwtToken({ username: user.username }) };
    } catch (error) {
      this.handleExceptions(error, 'A user');
    }
  }

  async login({ username, password }: LoginDto): Promise<any> {
    const userWithPassword = await this.userModel.findOne({ username });

    if (!userWithPassword)
      throw new BadRequestException('The username introduced is incorrect.');
    if (!compareSync(password, userWithPassword.password))
      throw new BadRequestException('The password introduced is incorrect.');

    const user = userWithPassword.toObject();
    const accessToken = this.setJwtToken({ id: user._id, role: user.role });
    delete user.password;

    return { userData: user, accessToken };
  }

  async validate(token: any) {
    try {
      this.jwtService.verify(token, this.configService.get('JWT_SECRET'));
      const { id, role }: any = this.jwtService.decode(token);

      return { userData: { id, role } };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const { id, role }: any = this.jwtService.decode(token);

        const userWithPassword = await this.userModel.findById(id);
        if (userWithPassword) {
          const user = userWithPassword.toObject();
          delete user.password;

          const accessToken = this.setJwtToken({ id, role });
          return { userData: user, token: accessToken };
        }
        throw new UnauthorizedException('El usuario no es válido.');
      }
    }
  }

  // async verification_token(request: Request, tokenAuthDto: TokenAuthDto) {
  //   const cookieData: string = request.cookies['Authorization'];
  //   const email: any = this.jwtService.decode(cookieData);
  //   const user = await this.userModel.findOne({ email: email.email });
  //   if (user.token !== tokenAuthDto.token) {
  //     throw new BadRequestException('The code is invalid');
  //   }
  //   await this.userModel.findByIdAndUpdate(
  //     user._id,
  //     { token: null },
  //     { new: true },
  //   );
  //   return true;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  createCookie(tokenData: string): string {
    const expiresIn = 60 * 60 * 24;

    return `Authorization=${tokenData}; max-age=${expiresIn}; HttpOnly; Path=/; Secure; SameSite=None;`;
  }

  private setJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: 60 * 60 * 24 * 365,
    });
  }

  private handleExceptions(error: any, entity?: string): never {
    this.lowerlevelExceptionHandler(error);

    console.error(error.message);

    if (error.code === 11000) {
      throw new BadRequestException({
        message: `${entity || 'An entity'} with that ${
          Object.keys(error.keyPattern)[0]
        } already exists in the database ${JSON.stringify(error.keyValue)}`,
      });
    }

    throw new InternalServerErrorException(
      `Something went wrong. ${error.message}`,
    );
  }

  private lowerlevelExceptionHandler(error: any): void {
    if (error.name === 'BadRequestException')
      throw new BadRequestException(error.message);
    if (error.name === 'InternalServerErrorException')
      throw new InternalServerErrorException(error.message);
    if (error.name === 'NotFoundException')
      throw new NotFoundException(error.message);
    if (error.name === 'UnauthorizedException')
      throw new UnauthorizedException(error.message);
  }
}
