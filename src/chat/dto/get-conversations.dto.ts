import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetConversationsDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  skip: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  take: number;
}
