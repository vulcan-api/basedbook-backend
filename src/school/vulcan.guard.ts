import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class VulcanGuard implements CanActivate {
  constructor(private readonly prisma: DbService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.userId },
      select: {
        loginID: true,
      },
    });
    return !!user?.loginID;
  }
}
