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
import { ReleaseArtistsModule } from './release-artists/release-artists.module';
import { ReleaseDesignersModule } from './release-designers/release-designers.module';
import { FeedbackStatusesModule } from './feedback-statuses/feedback-statuses.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReleaseRatingTypesModule } from './release-rating-types/release-rating-types.module';
import { UserFavReleasesModule } from './user-fav-releases/user-fav-releases.module';
import { UserFavReviewsModule } from './user-fav-reviews/user-fav-reviews.module';

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
    ReleaseArtistsModule,
    ReleaseDesignersModule,
    FeedbackStatusesModule,
    FeedbacksModule,
    ReviewsModule,
    ReleaseRatingTypesModule,
    UserFavReleasesModule,
    UserFavReviewsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
