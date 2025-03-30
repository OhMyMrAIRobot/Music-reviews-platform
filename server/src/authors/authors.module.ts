import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, PrismaService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
