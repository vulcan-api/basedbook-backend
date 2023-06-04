import { IsNotEmpty, IsString } from 'class-validator';

export class EditDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
