import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SkillsService } from './skills.service';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { AddSkillDto } from './dto/addSkill.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get('/:userId')
  async getSkills(@Param('userId') userId: number): Promise<object> {
    return await this.skillsService.getSkills(userId);
  }

  @Put()
  async addSkill(
    @GetUser() user: JwtAuthDto,
    @Body() body: AddSkillDto,
  ): Promise<object> {
    return await this.skillsService.addSkill(
      user.userId,
      body.skillId,
      body.skillLvl,
    );
  }

  @Delete(':userSkillId')
  async deleteSkill(
    @GetUser() user: JwtAuthDto,
    @Param('userSkillId') userSkillId: number,
  ): Promise<object> {
    return await this.skillsService.deleteSkill(user.userId, userSkillId);
  }
}
