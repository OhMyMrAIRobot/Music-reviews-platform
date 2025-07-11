import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { SocialMediaModule } from '../social-media/social-media.module';
import { ProfileSocialMediaController } from './controllers/profile-social-media.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfileSocialMediaService } from './services/profile-social-media.service';
import { ProfilesService } from './services/profiles.service';

@Module({
  imports: [SocialMediaModule, PrismaModule, UsersModule],
  controllers: [ProfilesController, ProfileSocialMediaController],
  providers: [ProfilesService, ProfileSocialMediaService],
  exports: [ProfilesService, ProfileSocialMediaService],
})
export class ProfilesModule {}
