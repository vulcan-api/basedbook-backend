import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  title: string;
  @IsOptional()
  text: string;
  @IsOptional()
  isAnonymous: boolean;
  @IsNotEmpty()
  @IsInt()
  id: number;
}
