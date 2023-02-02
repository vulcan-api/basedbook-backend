import { IsNotEmpty, IsString, IsNumberString, Length } from 'class-validator';

/*
 *  DTO class layout
 *  name - username
 *  password - user password
 *  token - token for UONET+
 *  pin - a number needed for UONET+
 *  symbol - a school/city/town/area of UONET+
 * */

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 7)
  token: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(6, 6)
  pin: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;
}
