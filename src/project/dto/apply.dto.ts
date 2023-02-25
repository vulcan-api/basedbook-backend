import { IsInt, IsPositive } from 'class-validator';

export class ApplyToProjectDto {
  @IsInt()
  @IsPositive()
  projectId: number;
}
