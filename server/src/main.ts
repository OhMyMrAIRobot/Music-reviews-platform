import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND,
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
