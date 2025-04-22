import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavReleasesController } from './user-fav-releases.controller';
import { UserFavReleasesService } from './user-fav-releases.service';

@Module({
  imports: [ReleasesModule, UsersModule],
  controllers: [UserFavReleasesController],
  providers: [UserFavReleasesService, PrismaService],
  exports: [UserFavReleasesService],
})
export class UserFavReleasesModule {}
