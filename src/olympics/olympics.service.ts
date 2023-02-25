import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class OlympicsService {
  constructor(private readonly prisma: DbService) {}

  async getAllOlympics(): Promise<object> {
    //return await this.prisma.olympics.findMany();
    // INFO: This is not working, and I committed it only because of git pull ;)
    return {};
  }
}
