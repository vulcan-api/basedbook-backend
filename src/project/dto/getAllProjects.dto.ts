import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetAllProjectsDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  skip?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  take?: number;
}
