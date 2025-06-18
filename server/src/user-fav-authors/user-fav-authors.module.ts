import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavAuthorsController } from './user-fav-authors.controller';
import { UserFavAuthorsService } from './user-fav-authors.service';

@Module({
  imports: [UsersModule, AuthorsModule, PrismaModule],
  controllers: [UserFavAuthorsController],
  providers: [UserFavAuthorsService],
  exports: [UserFavAuthorsService],
})
export class UserFavAuthorsModule {}
