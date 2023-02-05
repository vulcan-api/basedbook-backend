import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  title: string;
  @IsOptional()
  text: string;
  @IsNotEmpty()
  @IsInt()
  id: number;
}
