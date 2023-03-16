import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class ChangeQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  questionId: number;
}
