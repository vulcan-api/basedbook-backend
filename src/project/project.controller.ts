import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { ReportDto } from './dto/report.dto';
import { ApplyToProjectDto } from './dto/apply.dto';
import { GetAllProjectsDto } from './dto/getAllProjects.dto';
import { LeaveProjectDto } from './dto/leave.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects(
    @Query() query: GetAllProjectsDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.projectService.getAllProjects(
      query.skip ?? 0,
      query.take ?? 10,
      user.userId,
    );
  }

  @Get('/:id')
  getProject(
    @Param('id', ParseIntPipe) postId: number,
    @GetUser() user: JwtAuthDto,
  ): object {
    return this.projectService.getProjectById(postId, user.userId);
  }

  @Get('/:id/participants')
  getProjectParticipants(
    @Query('skip') skip = '0',
    @Query('take') take = '10',
    @Param('id') id: string,
  ): object {
    return this.projectService.getProjectParticipants(
      parseInt(skip),
      parseInt(take),
      parseInt(id),
    );
  }

  @Post()
  async addProject(
    @Body() body: CreateProjectDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.projectService.addProject(body, user.userId);
    return { body, statusCode: 201 };
  }

  @Patch()
  async updateProject(@Body() body: UpdateProjectDto): Promise<object> {
    await this.projectService.updateProjectById(body);
    return { body, statusCode: 200 };
  }

  @Delete('/:id')
  async deleteProject(@Param('id') id: number, @GetUser() user: JwtAuthDto) {
    await this.projectService.deleteProjectById(id, user.userId);
    return { ok: true, statusCode: 204 };
  }

  @Post('/report')
  @HttpCode(HttpStatus.CREATED)
  async reportPost(
    @Body() dto: ReportDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.projectService.report(dto.projectId, user.userId, dto.reason);
  }

  @Post('/apply')
  @HttpCode(HttpStatus.CREATED)
  async applyToProject(
    @Body() dto: ApplyToProjectDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.projectService.apply(dto.projectId, user.userId);
    return { statusCode: 200 };
  }
  @Post('/leave')
  @HttpCode(HttpStatus.CREATED)
  async leaveProject(
    @Body() dto: LeaveProjectDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.projectService.leave(dto.projectId, user.userId);
    return { statusCode: 200 };
  }
}
