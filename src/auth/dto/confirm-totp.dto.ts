import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class ConfirmTotpDto {
  @IsNotEmpty()
  @IsString()
  secret: string;

  @IsNumberString()
  @Length(6, 6)
  code: string;
}
