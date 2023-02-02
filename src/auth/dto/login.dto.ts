import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
