import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
