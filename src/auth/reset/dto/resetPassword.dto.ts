import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
  @IsEmail()
  email: string;
}
