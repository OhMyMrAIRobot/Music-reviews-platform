import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SocialMediaModule } from '../social-media/social-media.module';
import { ProfileSocialMediaController } from './controllers/profile-social-media.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfileSocialMediaService } from './services/profile-social-media.service';
import { ProfilesService } from './services/profiles.service';

@Module({
  imports: [SocialMediaModule],
  controllers: [ProfilesController, ProfileSocialMediaController],
  providers: [ProfilesService, ProfileSocialMediaService, PrismaService],
  exports: [ProfilesService, ProfileSocialMediaService],
})
export class ProfilesModule {}
