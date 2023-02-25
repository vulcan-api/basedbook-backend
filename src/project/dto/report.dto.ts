import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class ReportDto {
  @IsInt()
  @IsPositive()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  reason: string;
}
