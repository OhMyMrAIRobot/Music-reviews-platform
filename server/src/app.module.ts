import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MailsModule } from './mails/mails.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RolesModule,
    ProfilesModule,
    MailsModule,
    SocialMediaModule,
    AuthorsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
