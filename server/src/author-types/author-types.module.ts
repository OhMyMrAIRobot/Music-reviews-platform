import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesController } from './author-types.controller';
import { AuthorTypesService } from './author-types.service';

@Module({
  controllers: [AuthorTypesController],
  providers: [AuthorTypesService, PrismaService],
})
export class AuthorTypesModule {}
