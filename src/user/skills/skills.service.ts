import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { enumSkillLvl } from '@prisma/client';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: DbService) {}

  async addSkill(
    userId: number,
    skillId: number,
    skillLvl: enumSkillLvl,
  ): Promise<object> {
    const { prisma } = this;
    await prisma.userSkils.create({
      data: {
        userId,
        skillId,
        skillLvl,
      },
    });
    return { statusCode: 201, message: 'Skill added' };
  }

  async getSkills(userId: number): Promise<object> {
    const { prisma } = this;
    return await prisma.userSkils.findMany({
      where: { userId },
      include: { skill: true },
    });
  }
}
