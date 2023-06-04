import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveAccountDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
