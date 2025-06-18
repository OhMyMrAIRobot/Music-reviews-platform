import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorTypesModule } from 'src/author-types/author-types.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { AuthorsOnTypesController } from './authors-on-types.controller';
import { AuthorsOnTypesService } from './authors-on-types.service';

@Module({
  imports: [AuthorsModule, AuthorTypesModule, PrismaModule],
  controllers: [AuthorsOnTypesController],
  providers: [AuthorsOnTypesService],
  exports: [AuthorsOnTypesService],
})
export class AuthorsOnTypesModule {}
