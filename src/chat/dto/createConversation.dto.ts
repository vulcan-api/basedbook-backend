import { IsString, Length } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
