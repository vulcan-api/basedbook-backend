import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus,
  Param,
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

@UseGuards(AuthGuard('jwt'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Get()
  getAllProjects(
    @Query('skip') skip = '0',
    @Query('take') take = '10',
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.projectService.getAllProjects(parseInt(skip), parseInt(take));
  }
  @Get('/:id')
  getProject(@Param('id') id: string, @GetUser() user: JwtAuthDto): object {
    return this.projectService.getProjectById(parseInt(id));
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
  async updateProject(
    @Body() body: UpdateProjectDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    await this.projectService.updateProjectById(body);
    return { body, statusCode: 200 };
  }
  @Delete()
  async deleteProject(@Body('id') id: number, @GetUser() user: JwtAuthDto) {
    await this.projectService.deleteProjectById(id);
  }
  @Post('/report')
  @HttpCode(HttpStatus.CREATED)
  async reportPost(
    @Body() dto: ReportDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return this.projectService.report(dto.projectId, user.userId, dto.reason);
  }
}
