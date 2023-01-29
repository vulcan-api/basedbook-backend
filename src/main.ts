import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
const { PORT = 3000 } = process.env;

(async function () {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}...`);
  });
})();
