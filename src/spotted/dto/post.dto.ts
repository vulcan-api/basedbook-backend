import { IsInt, IsNotEmpty } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  @IsInt()
  authorId: number;
  @IsNotEmpty()
  isAnonymous: boolean;
}
