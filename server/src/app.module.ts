import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthorTypesModule } from './author-types/author-types.module';
import { AuthorsOnTypesModule } from './authors-on-types/authors-on-types.module';
import { AuthorsModule } from './authors/authors.module';
import { FeedbackStatusesModule } from './feedback-statuses/feedback-statuses.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FileModule } from './file/files.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MailsModule } from './mails/mails.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ReleaseArtistsModule } from './release-artists/release-artists.module';
import { ReleaseDesignersModule } from './release-designers/release-designers.module';
import { ReleaseProducersModule } from './release-producers/release-producers.module';
import { ReleaseRatingTypesModule } from './release-rating-types/release-rating-types.module';
import { ReleaseTypesModule } from './release-types/release-types.module';
import { ReleasesModule } from './releases/releases.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RolesModule } from './roles/roles.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { UserFavAuthorsModule } from './user-fav-authors/user-fav-authors.module';
import { UserFavReleasesModule } from './user-fav-releases/user-fav-releases.module';
import { UserFavReviewsModule } from './user-fav-reviews/user-fav-reviews.module';
import { UsersModule } from './users/users.module';
import { FeedbackResponsesModule } from './feedback-responses/feedback-responses.module';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    AuthModule,
    RolesModule,
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
    FeedbackModule,
    ReviewsModule,
    ReleaseRatingTypesModule,
    UserFavReleasesModule,
    UserFavReviewsModule,
    UserFavAuthorsModule,
    PrismaModule,
    LeaderboardModule,
    FileModule,
    FeedbackResponsesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
