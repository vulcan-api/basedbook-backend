import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  @Length(1, 50000) //TODO: Change to making sense value
  readonly text: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  commentId?: number;
}
