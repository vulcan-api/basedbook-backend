import { IsNotEmpty } from 'class-validator';

export class InsertPostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  isAnonymous: boolean;
}
