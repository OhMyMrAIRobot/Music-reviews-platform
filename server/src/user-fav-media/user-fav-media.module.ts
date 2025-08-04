import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleaseMediaModule } from 'src/release-media/release-media.module';
import { UsersModule } from 'src/users/users.module';
import { UserFavMediaController } from './user-fav-media.controller';
import { UserFavMediaService } from './user-fav-media.service';

@Module({
  imports: [PrismaModule, ReleaseMediaModule, UsersModule],
  controllers: [UserFavMediaController],
  providers: [UserFavMediaService],
  exports: [UserFavMediaService],
})
export class UserFavMediaModule {}
