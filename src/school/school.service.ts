/* 
  Copyright (c) 2020 Capure
  Copyleft 2023 sewe2000
*/
import { Injectable } from '@nestjs/common';
import {
  AccountTools,
  Keystore,
  registerAccount,
  VulcanHebe,
} from 'vulcan-api-js';
import { DbService } from '../db/db.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { VulcanSigner } from './vulcan-signer.service';
import { VulcanDto } from './dto/vulcanDto';

@Injectable()
export class SchoolService {
  private readonly USER_AGENT = 'Dart/2.10 (dart:io)';
  private readonly APP_OS = 'Android';
  private readonly DEVICE_NAME = 'BasedBook';
  constructor(
    private readonly prisma: DbService,
    private readonly signer: VulcanSigner,
  ) {}
  private buildHeaders(
    fullUrl: string,
    payload: string,
    fingerprint: string,
    privateKey: string,
  ): HeadersInit {
    const dt = new Date();
    const { digest, canonicalUrl, signature } = this.signer.getSignatureValues(
      fingerprint,
      privateKey,
      payload,
      fullUrl,
      dt.toUTCString(),
    );

    const headers: any = {
      'User-Agent': this.USER_AGENT,
      vOS: this.APP_OS,
      vDeviceModel: this.DEVICE_NAME,
      vAPI: '1',
      vDate: dt.toUTCString(),
      vCanonicalUrl: canonicalUrl,
      Signature: signature,
    };

    if (digest) {
      headers['Digest'] = digest;
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

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
      where: { id: user.userId },
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
    const lesson = (await vulcanClient.getLessons(lastSemester.start.date))[0];

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
        class_name: lastSemester.level + lesson.class?.symbol,
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

  async getMessages(user: JwtAuthDto): Promise<object[]> {
    const client = await this.getClient(user);
    const {
      restURL: { url },
      fingerprint,
      privateKey,
    }: {
      restURL: any;
      fingerprint: string | null;
      privateKey: string | null;
    } = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.userId },
      select: {
        restURL: {
          select: {
            url: true,
          },
        },
        fingerprint: true,
        privateKey: true,
      },
    });
    const student = (await client.getStudents())[0];
    let canonicalPath = '/api/mobile/messagebox/';
    let requestUrl = url + `${student.unit.symbol}${canonicalPath}`;
    let mailboxId = '';
    await fetch(requestUrl, {
      headers: this.buildHeaders(
        requestUrl,
        '',
        fingerprint ?? '',
        privateKey ?? '',
      ),
    })
      .then((response) => {
        if (!response.ok) console.log(response.status);
        return response.json();
      })
      .then((jsonResponse) => {
        mailboxId = jsonResponse['Envelope']['GlobalKey'];
      });

    canonicalPath = `/api/mobile/messagebox/message/byBox`;
    /*    canonicalPath += `?box=${mailboxId}&folder=1&lastId=-2147483648&pageSize=500&lastSyncDate=${
      (dateFormat(new Date('1970')), 'yyyy-mm-dd HH:MM:ss')
    }`; */
    requestUrl = url + `${student.unit.symbol}${canonicalPath}`;

    await fetch(requestUrl, {
      headers: this.buildHeaders(
        requestUrl,
        '',
        fingerprint ?? '',
        privateKey ?? '',
      ),
    })
      .then((response) => {
        if (!response.ok) console.log(response.status);
        return response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
      });
    return [{}];
  }
}
