import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorTypesModule } from 'src/author-types/author-types.module';
import { FileModule } from 'src/file/files.module';
import { UsersModule } from 'src/users/users.module';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

@Module({
  imports: [PrismaModule, AuthorTypesModule, FileModule, UsersModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
