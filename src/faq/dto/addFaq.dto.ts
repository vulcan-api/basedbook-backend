import { IsNotEmpty, IsString } from 'class-validator';

export class AddFaqDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}
