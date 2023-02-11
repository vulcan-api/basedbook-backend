import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaExceptionFilter } from './db/exception/prismaException.filter';

dotenv.config();
const { PORT = 3000 } = process.env;

(async function () {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}...`);
  });
})();
