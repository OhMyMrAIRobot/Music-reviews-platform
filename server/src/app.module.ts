import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MailsModule } from './mails/mails.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { AuthorsModule } from './authors/authors.module';
import { AuthorTypesModule } from './author-types/author-types.module';
import { AuthorsOnTypesModule } from './authors-on-types/authors-on-types.module';
import { ReleaseTypesModule } from './release-types/release-types.module';
import { ReleasesModule } from './releases/releases.module';
import { ReleaseProducersModule } from './release-producers/release-producers.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RolesModule,
    ProfilesModule,
    MailsModule,
    SocialMediaModule,
    AuthorsModule,
    AuthorTypesModule,
    AuthorsOnTypesModule,
    ReleaseTypesModule,
    ReleasesModule,
    ReleaseProducersModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
