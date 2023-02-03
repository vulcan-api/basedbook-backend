import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class PostDto {
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

export class UpdatePostDto {
  @IsOptional()
  title: string;
  @IsOptional()
  text: string;
  @IsOptional()
  isAnonymous: boolean;
  @IsNotEmpty()
  @IsInt()
  id: number;
}
