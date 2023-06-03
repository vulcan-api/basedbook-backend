import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendDto {
  @IsInt()
  conversation: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
