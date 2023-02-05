import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { DbService } from '../db/db.service';
import { sha512 } from 'js-sha512';
import {
  AccountTools,
  Keystore,
  registerAccount,
  VulcanHebe,
} from 'vulcan-api-js';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DbService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(dto: RegisterDto, res: Response): Promise<Response> {
    const sampleUser = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (sampleUser) throw new ForbiddenException('Credentials taken!');

    const keystore = new Keystore();
    await keystore.init('Muj Elektryk');

    const vulcanAccount = await registerAccount(
      keystore,
      dto.token,
      dto.symbol,
      dto.pin,
    );
    const vulcanClient = new VulcanHebe(
      keystore,
      AccountTools.loadFromObject(vulcanAccount),
    );
    await vulcanClient.selectStudent();

    const student = (await vulcanClient.getStudents())[0];
    const lesson = (await vulcanClient.getLessons(new Date('2022-09-02')))[0];
    const classNumber = student.periods.at(-1)?.level;

    const restURL = await this.prisma.restURL.upsert({
      create: {
        url: vulcanAccount.restUrl,
      },
      where: {
        url: vulcanAccount.restUrl,
      },
      update: {},
    });

    await this.prisma.user.create({
      data: {
        name: student.pupil.firstName,
        username: dto.username,
        surname: student.pupil.surname,
        class_name:
          classNumber && lesson.class?.symbol
            ? classNumber + lesson.class.symbol
            : '',
        passwordHash: sha512(dto.password),
        profileDesc: '',
        avatar: '',
        postsProjects: '',
        skills: '',
        profileSettings: '',
        restURLId: restURL.id,
        loginID: vulcanAccount.loginId,
        email: dto.email,
        certificate: keystore.certificate ?? '',
        fingerprint: keystore.fingerprint ?? '',
        privateKey: keystore.privateKey ?? '',
        firebaseToken: keystore.firebaseToken ?? '',
      },
    });

    /* sending confirmation email */
    await this.mailerService.sendMail({
      to: dto.email,
      from: 'noreply@muj-elektryk.com',
      subject: 'Potwierdzenie adresu email w serwisie Muj Elektryk',
      html: '<h1>Tutaj jakiś link potwierdzający</h1>',
    });

    res.cookie('test', 'value', { httpOnly: true });
    return res;
  }

  async login(dto: LoginDto, res: Response): Promise<Response> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: dto.email },
    });

    if (sha512(dto.password) === user.passwordHash) {
      res.cookie('test', 'value', { httpOnly: true });
      return res;
    }
    throw new ForbiddenException('Wrong credentials!');
  }
}
