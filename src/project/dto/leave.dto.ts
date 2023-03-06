import { IsInt, IsPositive } from 'class-validator';

export class LeaveProjectDto {
  @IsInt()
  @IsPositive()
  projectId: number;
}
