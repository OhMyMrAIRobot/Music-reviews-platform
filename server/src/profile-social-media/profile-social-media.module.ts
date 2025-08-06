import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { SocialMediaModule } from 'src/social-media/social-media.module';
import { UsersModule } from 'src/users/users.module';
import { ProfileSocialMediaController } from './profile-social-media.controller';
import { ProfileSocialMediaService } from './profile-social-media.service';

@Module({
  imports: [PrismaModule, ProfilesModule, UsersModule, SocialMediaModule],
  controllers: [ProfileSocialMediaController],
  providers: [ProfileSocialMediaService],
  exports: [ProfileSocialMediaService],
})
export class ProfileSocialMediaModule {}
