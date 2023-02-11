import { Injectable } from '@nestjs/common';
import { AccountTools, Keystore, VulcanHebe } from 'vulcan-api-js';
import { DbService } from '../db/db.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: DbService) {}

  private async getClient(user: JwtAuthDto): Promise<VulcanHebe> {
    const keystore = new Keystore();
    const tokens = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        certificate: true,
        fingerprint: true,
        privateKey: true,
        firebaseToken: true,
      },
    });
    (keystore.loadFromObject as any)({
      ...tokens,
      deviceModel: 'Muj Elektryk',
    });

    const {
      restURL: { url },
      loginID,
      email,
    }: {
      restURL: { url: string };
      loginID: number;
      email: string;
    } = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.userId },
      select: {
        loginID: true,
        email: true,
        restURL: {
          select: { url: true },
        },
      },
    });
    const client = new VulcanHebe(
      keystore,
      AccountTools.loadFromObject({
        loginId: loginID,
        userLogin: email,
        userName: email,
        restUrl: url,
      }),
    );
    await client.selectStudent();
    return client;
  }

  async getLastSemester(client: VulcanHebe): Promise<any> {
    const students = await client.getStudents();
    return students[0].periods.at(-1) ?? {};
  }

  async getGrades(last = 10, user: JwtAuthDto): Promise<object> {
    const client = await this.getClient(user);
    const lastSemester = await this.getLastSemester(client);
    return (await client.getGrades(lastSemester.start.Date)).slice(-last);
  }

  async getLessons(
    from: Date,
    to: Date,
    user: JwtAuthDto,
  ): Promise<{ lessons: object[] }> {
    const client = await this.getClient(user);
    return { lessons: await client.getLessons(from, to) };
  }

  async getLuckyNumber(user: JwtAuthDto): Promise<object> {
    const client = await this.getClient(user);
    return client.getLuckyNumber();
  }

  async getStudent(user: JwtAuthDto): Promise<object> {
    const client = await this.getClient(user);
    return (await client.getStudents())[0];
  }
}
