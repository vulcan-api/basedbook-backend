import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  questionId: number;
}
