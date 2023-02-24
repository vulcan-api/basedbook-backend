import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  text: string;
}
