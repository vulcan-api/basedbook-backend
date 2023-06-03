import { IsInt } from 'class-validator';

export class AddAdminDto {
  @IsInt()
  conversationId: number;

  @IsInt()
  userId: number;
}
