import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsInt()
  @Min(1)
  @Max(5)
  avatarId: number;
}
