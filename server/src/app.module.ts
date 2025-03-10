import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MailsModule } from './mails/mails.module';
import { SocialMediaModule } from './social-media/social-media.module';

@Module({
  imports: [UsersModule, AuthModule, RolesModule, ProfilesModule, MailsModule, SocialMediaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
