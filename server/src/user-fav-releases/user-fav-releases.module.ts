import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavReleasesController } from './user-fav-releases.controller';
import { UserFavReleasesService } from './user-fav-releases.service';

@Module({
  imports: [ReleasesModule, UsersModule, PrismaModule],
  controllers: [UserFavReleasesController],
  providers: [UserFavReleasesService],
  exports: [UserFavReleasesService],
})
export class UserFavReleasesModule {}
