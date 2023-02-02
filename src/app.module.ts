import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { SpottedModule } from './spotted/spotted.module';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SpottedModule,
  ],
  providers: [AppService],
})
export class AppModule {}
