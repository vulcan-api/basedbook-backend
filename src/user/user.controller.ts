import {
  Controller,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SpottedService } from '../spotted/spotted.service';
import { ProjectService } from '../project/project.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly spottedService: SpottedService,
    private readonly projectService: ProjectService,
  ) {}

  @Get()
  async findUsersByName(@Query('name') name: string): Promise<object[]> {
    if (name) return this.userService.findUsersByUserName(name);
    return [];
  }

  @Get('/:userId')
  async getPublicInformation(
    @Param('userId') userId: string,
    @GetUser() user: JwtAuthDto,
  ) {
    return this.userService.getPublicInformation(+userId, user.userId);
  }

  @Get('/:userId/spottedPosts')
  async getSpottedPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.spottedService.getUsersPosts(0, 999, userId);
  }

  @Get('/:userId/projects')
  async getProjects(@Param('userId') userId: string) {
    return this.projectService.getUserProjects(parseInt(userId));
  }
}
