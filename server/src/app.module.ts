import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthorCommentsModule } from './author-comments/author-comments.module';
import { AuthorConfirmationStatusesModule } from './author-confirmation-statuses/author-confirmation-statuses.module';
import { AuthorTypesModule } from './author-types/author-types.module';
import { AuthorsModule } from './authors/authors.module';
import { FeedbackRepliesModule } from './feedback-replies/feedback-replies.module';
import { FeedbackStatusesModule } from './feedback-statuses/feedback-statuses.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FileModule } from './file/files.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MailsModule } from './mails/mails.module';
import { ProfileSocialMediaModule } from './profile-social-media/profile-social-media.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RegisteredAuthorsModule } from './registered-authors/registered-authors.module';
import { ReleaseMediaStatusesModule } from './release-media-statuses/release-media-statuses.module';
import { ReleaseMediaTypesModule } from './release-media-types/release-media-types.module';
import { ReleaseMediaModule } from './release-media/release-media.module';
import { ReleaseTypesModule } from './release-types/release-types.module';
import { ReleasesModule } from './releases/releases.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RolesModule } from './roles/roles.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { UserFavAuthorsModule } from './user-fav-authors/user-fav-authors.module';
import { UserFavMediaModule } from './user-fav-media/user-fav-media.module';
import { UserFavReleasesModule } from './user-fav-releases/user-fav-releases.module';
import { UserFavReviewsModule } from './user-fav-reviews/user-fav-reviews.module';
import { UsersModule } from './users/users.module';
import { AuthorConfirmationsModule } from './author-confirmations/author-confirmations.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    ProfilesModule,
    AuthModule,
    RolesModule,
    MailsModule,
    SocialMediaModule,
    AuthorsModule,
    AuthorTypesModule,
    ReleaseTypesModule,
    ReleasesModule,
    FeedbackStatusesModule,
    FeedbackModule,
    ReviewsModule,
    UserFavReleasesModule,
    UserFavReviewsModule,
    UserFavAuthorsModule,
    PrismaModule,
    LeaderboardModule,
    FileModule,
    FeedbackRepliesModule,
    ReleaseMediaStatusesModule,
    ReleaseMediaTypesModule,
    ReleaseMediaModule,
    UserFavMediaModule,
    ProfileSocialMediaModule,
    RegisteredAuthorsModule,
    AuthorCommentsModule,
    AuthorConfirmationStatusesModule,
    AuthorConfirmationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
