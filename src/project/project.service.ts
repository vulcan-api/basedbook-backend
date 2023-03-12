import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project-dto';

// TODO:
// - add isAlreadyApplied property to the return object
// - refactor prisma into plain sql because it's not possible to do above task with prisma (I think so :D)

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: DbService) {}

  async getAllProjects(
    skip: number,
    take: number,
    userId: number,
  ): Promise<any> {
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
            id: true,
            username: true,
          },
        },
        UserProject: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
        },
      },
    });
    return projects.map((project) => ({
      ...project,
      hasAlreadyApplied: project.UserProject.some(
        (userProject) => userProject.user?.id === userId,
      ),
      isOwned: project.author.id === userId,
    }));
  }

  getProjectParticipants(
    skip: number,
    take: number,
    projectId: number,
  ): Promise<any> {
    return this.prisma.userProject.findMany({
      where: { projectId: projectId },
      select: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      skip,
      take,
    });
  }

  async getProjectById(postId: number, userId: number): Promise<object> {
    const project: { [key: string]: any } =
      await this.prisma.project.findUniqueOrThrow({
        where: { id: postId },
        select: {
          id: true,
          createdAt: true,
          title: true,
          text: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
    project.isOwned = project.author.id === userId;
    return project;
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

  async deleteProjectById(id: number, userId: number) {
    await this.prisma.project.deleteMany({ where: { id, authorId: userId } });
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

  async getUserProjects(userId: number): Promise<any> {
    const projects: { [key: string]: any } = await this.prisma.project.findMany(
      {
        where: { authorId: userId },
        select: {
          id: true,
          createdAt: true,
          title: true,
          text: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          UserProject: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    );
    return projects.map((project: any) => {
      project.hasAlreadyApplied = project.UserProject.some(
        (userProject: any) => userProject.user.id === userId,
      );
      delete project.UserProject;
      return project;
    });
  }

  async leave(projectId: number, userId: number): Promise<object> {
    await this.prisma.userProject.deleteMany({
      where: { projectId, userId },
    });
    return { msg: 'Successfully left the project' };
  }
}
