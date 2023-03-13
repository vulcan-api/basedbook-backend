import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsInt()
  @IsNumber()
  @IsPositive()
  userId: number;
}
