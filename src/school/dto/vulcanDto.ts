import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class VulcanDto {
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
