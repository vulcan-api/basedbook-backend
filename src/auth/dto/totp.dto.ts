import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class TotpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  code: string;
}
