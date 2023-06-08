import { IsInt, Max, Min } from 'class-validator';

export class UpdateConversationAvatarDto {
  @IsInt()
  @Min(1)
  @Max(5)
  avatarId: number;
}
