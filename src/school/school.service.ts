import { Injectable } from '@nestjs/common';
import {
  AccountTools,
  Attendance,
  Exam,
  Homework,
  Keystore,
  registerAccount,
  VulcanHebe,
} from 'vulcan-api-js';
import { DbService } from '../db/db.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { VulcanDto } from './dto/vulcanDto';
import {
  Grade,
  Lesson,
  LuckyNumber,
  Period,
  Student,
  Message,
} from 'vulcan-api-js';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: DbService) {}

  private async getClient(userId: number): Promise<VulcanHebe> {
    const keystore = new Keystore();
    const tokens = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        certificate: true,
        fingerprint: true,
        privateKey: true,
        firebaseToken: true,
      },
    });
    (keystore.loadFromObject as any)({
      ...tokens,
      deviceModel: 'BasedBook',
    });

    const {
      restURL: { url },
      loginID,
      email,
    }: {
      restURL: any;
      loginID: number | null;
      email: string;
    } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        loginID: true,
        email: true,
        restURL: {
          select: { url: true },
        },
      },
    });
    if (loginID === null) throw Error('LoginID cannot be null!');

    const client = new VulcanHebe(
      keystore,
      AccountTools.loadFromObject({
        loginId: loginID ?? 0,
        userLogin: email,
        userName: email,
        restUrl: url,
      }),
    );
    await client.selectStudent();
    return client;
  }

  async register(vulcanData: VulcanDto, user: JwtAuthDto): Promise<object> {
    const keystore = new Keystore();
    await keystore.init('BasedBook');

    const vulcanAccount = await registerAccount(
      keystore,
      vulcanData.token,
      vulcanData.symbol,
      vulcanData.pin,
    );
    const vulcanClient = new VulcanHebe(
      keystore,
      AccountTools.loadFromObject(vulcanAccount),
    );
    await vulcanClient.selectStudent();

    const student = (await vulcanClient.getStudents())[0];
    const lastSemester = await this.getLastSemester(vulcanClient);
    const lesson = (await vulcanClient.getLessons(lastSemester.start.Date))[0];

    const restURL = await this.prisma.restURL.upsert({
      create: {
        url: vulcanAccount.restUrl,
      },
      where: {
        url: vulcanAccount.restUrl,
      },
      update: {},
    });

    await this.prisma.user.update({
      where: { id: user.userId },
      data: {
        name: student.pupil.firstName,
        surname: student.pupil.surname,
        class_name: lastSemester?.level + (lesson?.class?.symbol ?? ''),
        loginID: student.pupil.loginId,
        restURLId: restURL.id,
        certificate: keystore.certificate,
        fingerprint: keystore.fingerprint,
        privateKey: keystore.privateKey,
        firebaseToken: keystore.firebaseToken,
      },
    });

    return {
      msg: 'Successfully registered an UONET+ account',
    };
  }

  async getLastSemester(client: VulcanHebe): Promise<Period> {
    const students = await client.getStudents();
    return students[0].periods.at(-1) ?? new Period();
  }

  async getGrades(last = 10, userId: number): Promise<Grade[]> {
    const client = await this.getClient(userId);
    const lastSemester = await this.getLastSemester(client);
    return (
      await client.getGrades(lastSemester.start.Date ?? new Date())
    ).slice(-last);
  }

  async getLessons(from: Date, to: Date, userId: number): Promise<Lesson[]> {
    const client = await this.getClient(userId);
    return client.getLessons(from, to);
  }

  async getLuckyNumber(userId: number): Promise<LuckyNumber> {
    const client = await this.getClient(userId);
    return client.getLuckyNumber();
  }

  async getStudent(userId: number): Promise<Student> {
    const client = await this.getClient(userId);
    return (await client.getStudents())[0];
  }

  async getMessages(userId: number): Promise<Message[]> {
    const client = await this.getClient(userId);
    const messageBoxId = (await client.getMessageBoxes())[0].globalKey;
    return client.getMessages(messageBoxId);
  }

  async getHomework(userId: number): Promise<Homework[]> {
    const client = await this.getClient(userId);
    return client.getHomework();
  }
  async getExams(userId: number): Promise<Exam[]> {
    const client = await this.getClient(userId);
    return client.getExams();
  }

  async getAttendance(
    userId: number,
    from: Date,
    to: Date,
  ): Promise<Attendance[]> {
    const client = await this.getClient(userId);
    return client.getAttendance(from, to);
  }
}
