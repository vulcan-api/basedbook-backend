import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class JwtAuthDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  roles: ('USER' | 'MODERATOR' | 'FAQ')[];
}
