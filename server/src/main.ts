import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
