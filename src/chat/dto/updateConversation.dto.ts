import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  avatarId?: number;
}
