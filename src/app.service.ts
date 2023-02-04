import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: DbService) {}
  async getPosts(): Promise<object> {
    const spottedPosts = await this.prisma.spottedPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(spottedPosts);
    return {
      spottedPosts,
      projects,
    };
  }
}
