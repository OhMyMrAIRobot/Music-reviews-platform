import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileSocialMediaController } from './profile-social-media.controller';
import { SocialMediaModule } from '../social-media/social-media.module';
import { ProfileSocialMediaService } from './profile-social-media.service';

@Module({
  imports: [SocialMediaModule],
  controllers: [ProfilesController, ProfileSocialMediaController],
  providers: [ProfilesService, ProfileSocialMediaService, PrismaService],
  exports: [ProfilesService, ProfileSocialMediaService],
})
export class ProfilesModule {}
