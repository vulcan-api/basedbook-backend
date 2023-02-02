import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { DbService } from '../db/db.service';
import bcrypt from 'bcrypt';
import {
  AccountTools,
  Keystore,
  registerAccount,
  VulcanHebe,
} from 'vulcan-api-js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: DbService) {}
  async signup(dto: RegisterDto): Promise<object> {
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
    const saltRounds = 10;
    let hashedPassword = '';
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(dto.password, salt, (err, hash) => {
        hashedPassword = hash;
      });
    });

    try {
      const restURL = await this.prisma.restURL.upsert({
        create: {
          url: vulcanAccount.restUrl,
        },
        where: {
          url: vulcanAccount.restUrl,
        },
        update: {},
      });
      return await this.prisma.user.create({
        data: {
          name: student.pupil.firstName,
          username: dto.username,
          surname: student.pupil.surname,
          class_name:
            classNumber && lesson.class?.symbol
              ? classNumber + lesson.class.symbol
              : '',
          passwordHash: hashedPassword,
          profileDesc: '',
          avatar: '',
          postsProjects: '',
          skills: '',
          profileSettings: '',
          restURLId: restURL.id,
          loginID: vulcanAccount.loginId,
          email: vulcanAccount.userLogin,
          certificate: keystore.certificate ?? '',
          fingerprint: keystore.fingerprint ?? '',
          privateKey: keystore.privateKey ?? '',
          firebaseToken: keystore.firebaseToken ?? '',
        },
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken!');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<object> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username: dto.username },
    });

    bcrypt.compare(dto.password, user.passwordHash, (err, result) => {
      if (result) return user;
    });
    throw new ForbiddenException('Wrong credentials!');
  }
}
