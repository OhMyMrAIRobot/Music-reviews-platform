import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleaseMediaStatusesModule } from 'src/release-media-statuses/release-media-statuses.module';
import { ReleaseMediaTypesModule } from 'src/release-media-types/release-media-types.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { ReleaseMediaController } from './release-media.controller';
import { ReleaseMediaService } from './release-media.service';

@Module({
  imports: [
    PrismaModule,
    ReleaseMediaTypesModule,
    ReleaseMediaStatusesModule,
    ReleasesModule,
    UsersModule,
  ],
  controllers: [ReleaseMediaController],
  providers: [ReleaseMediaService],
  exports: [ReleaseMediaService],
})
export class ReleaseMediaModule {}
