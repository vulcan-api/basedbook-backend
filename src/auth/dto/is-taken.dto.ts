import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class IsTakenDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  username: string;
}
