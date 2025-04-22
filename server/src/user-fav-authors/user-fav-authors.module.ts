import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsModule } from 'src/authors/authors.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavAuthorsController } from './user-fav-authors.controller';
import { UserFavAuthorsService } from './user-fav-authors.service';

@Module({
  imports: [UsersModule, AuthorsModule],
  controllers: [UserFavAuthorsController],
  providers: [UserFavAuthorsService, PrismaService],
  exports: [UserFavAuthorsService],
})
export class UserFavAuthorsModule {}
