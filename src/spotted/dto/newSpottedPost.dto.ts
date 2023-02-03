import { IsInt, IsNotEmpty } from 'class-validator';

export class NewSpottedPostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  text: string;
  // TODO: auto getting authorID from cookie jwt
  @IsNotEmpty()
  @IsInt()
  authorId: number;
  @IsNotEmpty()
  isAnonymous: boolean;
}
