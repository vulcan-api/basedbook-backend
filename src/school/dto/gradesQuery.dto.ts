import { IsOptional, IsPositive } from 'class-validator';

export class GradesQueryDto {
  @IsOptional()
  @IsPositive()
  last?: number;
}
