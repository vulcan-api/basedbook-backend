import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { SpottedModule } from './spotted/spotted.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProjectModule } from './project/project.module';
import * as process from 'process';
import { SchoolModule } from './school/school.module';
import { UserModule } from './user/user.module';
import { OlympicsModule } from './olympics/olympics.module';
import { OauthModule } from './oauth/oauth.module';
import { FaqModule } from './faq/faq.module';
import { CachingMiddleware } from './middleware/caching.middleware';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SpottedModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: 'Muj Elektryk',
        },
      }),
    }),
    ProjectModule,
    SchoolModule,
    UserModule,
    OlympicsModule,
    // OauthModule,
    FaqModule,
    ChatModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(CachingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
