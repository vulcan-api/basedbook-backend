import { IsDate } from 'class-validator';

export class LessonsQueryDto {
  @IsDate()
  from: Date;
  @IsDate()
  to: Date;
}
