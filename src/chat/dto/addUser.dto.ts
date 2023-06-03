import { IsInt } from 'class-validator';

export class AddUserDto {
  @IsInt()
  conversationId: number;

  @IsInt()
  userId: number;
}
