import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: DbService) {}
  async getPosts(): Promise<object> {
    const columns = {
      createdAt: true,
      title: true,
      text: true,
      author: {
        select: {
          username: true,
          surname: true,
          name: true,
          class_name: true,
          avatar: true,
        },
      },
    };

    const spottedPosts = await this.prisma.spottedPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: columns,
    });

    (columns as any).UserProject = {
      select: {
        Users: true,
      },
    };

    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      select: columns,
    });

    return {
      spottedPosts,
      projects,
    };
  }
}
