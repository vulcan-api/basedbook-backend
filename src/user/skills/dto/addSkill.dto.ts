import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { enumSkillLvl } from '@prisma/client';

export class AddSkillDto {
  @IsNumber()
  @IsNotEmpty()
  skillId: number;
  @IsNotEmpty()
  @IsString()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  skillLvl: enumSkillLvl;
}
