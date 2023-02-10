import { Injectable } from '@nestjs/common';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';
import { DbService } from 'src/db/db.service';
import { AccountTools, Keystore, VulcanHebe } from 'vulcan-api-js';
import {
  Grade,
  Lesson,
  LuckyNumber,
  Period,
  Student,
} from 'vulcan-api-js/lib/models';

@Injectable()
export class SchoolService {
  private keystore: Keystore;
  private client: VulcanHebe;

  constructor(private readonly prisma: DbService) {}

  async init(user: JwtAuthDto): Promise<void> {
    this.keystore = new Keystore();
    const tokens = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        certificate: true,
        fingerprint: true,
        privateKey: true,
        firebaseToken: true,
      },
    });
    (this.keystore.loadFromObject as any)({
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
    this.client = new VulcanHebe(
      this.keystore,
      AccountTools.loadFromObject({
        loginId: loginID,
        userLogin: email,
        userName: email,
        restUrl: url,
      }),
    );
    await this.client.selectStudent();
  }

  async getLastSemester(): Promise<Period> {
    const students = await this.client.getStudents();
    return students[0].periods.at(-1) ?? new Period();
  }

  async getGrades(last = 10): Promise<Grade[]> {
    const lastSemester = await this.getLastSemester();
    return (await this.client.getGrades(lastSemester.start.Date)).slice(-last);
  }

  async getLessons(from: Date, to: Date): Promise<{ lessons: Lesson[] }> {
    return { lessons: await this.client.getLessons(from, to) };
  }

  async getLuckyNumber(): Promise<LuckyNumber> {
    return this.client.getLuckyNumber();
  }

  async getStudent(): Promise<Student> {
    return (await this.client.getStudents())[0];
  }
}
