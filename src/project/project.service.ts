import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project-dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: DbService) {}
  async getAllProjects(skip: number, take: number): Promise<any> {
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        createdAt: true,
        title: true,
        text: true,
        author: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    const formattedProjects = projects.map((project) => ({
      ...project,
      username: `${project.author.name} ${project.author.surname}`,
    }));

    return formattedProjects;
  }

  getProjectParticipants(
    skip: number,
    take: number,
    projectId: number,
  ): Promise<any> {
    return this.prisma.userProject.findMany({
      where: { projectId: projectId },
      skip,
      take,
    });
  }
  getProjectById(id: number): Promise<any> {
    return this.prisma.project.findUnique({ where: { id } });
  }
  async addProject(projectData: CreateProjectDto, authorId: number) {
    await this.prisma.project.create({
      data: Object.assign(projectData, { authorId }),
    });
  }
  async updateProjectById(projectData: UpdateProjectDto) {
    const { id } = projectData;
    await this.prisma.project.update({
      data: projectData,
      where: { id },
    });
  }
  async deleteProjectById(id: number) {
    await this.prisma.project.delete({ where: { id } });
  }
  async report(
    projectId: number,
    userId: number,
    reason: string,
  ): Promise<object> {
    await this.prisma.report.create({
      data: {
        userId,
        projectId: projectId,
        reason,
      },
    });
    return { msg: 'Successfully reported the post' };
  }
  async apply(projectId: number, userId: number): Promise<object> {
    await this.prisma.userProject
      .create({
        data: {
          projectId: projectId,
          userId,
        },
      })
      .catch((err) => {
        console.error(err);
        throw new HttpException(
          `CONFLICT: user nr. ${userId} have already applied to the project with id: ${projectId}`,
          HttpStatus.CONFLICT,
        );
      });
    return { msg: 'Successfully applied to the project' };
  }
}
