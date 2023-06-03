import { IsString, Length } from 'class-validator';

export class UpdateConversationNameDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
