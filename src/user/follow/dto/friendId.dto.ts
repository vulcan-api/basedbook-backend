import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class FriendIdDto {
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @IsPositive()
  friendId: number;
}
