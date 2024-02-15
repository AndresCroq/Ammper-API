import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { safePassword } from 'src/common/utils';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(safePassword)
  password: string;
}
