import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorTypesModule } from 'src/author-types/author-types.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { AuthorsOnTypesController } from './authors-on-types.controller';
import { AuthorsOnTypesService } from './authors-on-types.service';

@Module({
  imports: [AuthorsModule, AuthorTypesModule],
  controllers: [AuthorsOnTypesController],
  providers: [AuthorsOnTypesService, PrismaService],
  exports: [AuthorsOnTypesService],
})
export class AuthorsOnTypesModule {}
