import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project-dto';

//TODO
//Authentication
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Get()
  getAllProjects(
    @Query('skip') skip = '0',
    @Query('take') take = '10',
  ): Promise<object> {
    return this.projectService.getAllProjects(parseInt(skip), parseInt(take));
  }
  @Get('/:id')
  getProject(@Param('id') id: string): object {
    return this.projectService.getProjectById(parseInt(id));
  }
  @Post()
  async addProject(@Body() body: CreateProjectDto): Promise<object> {
    await this.projectService.addProject(body);
    return { body, statusCode: 201 };
  }
  @Patch()
  async updateProject(@Body() body: UpdateProjectDto): Promise<object> {
    await this.projectService.updateProjectById(body);
    return { body, statusCode: 200 };
  }
  @Delete()
  async deletePost(@Body('id') id: number) {
    await this.projectService.deleteProjectById(id);
  }
}
