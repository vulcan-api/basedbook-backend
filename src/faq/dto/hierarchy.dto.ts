import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class HierarchyDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  questionId: number;

  @IsNotEmpty()
  @IsInt()
  hierarchy: number;
}
