import { UserFavReview } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

type ReleaseAuthorLink = { authorId: string };

type ReviewWithReleaseAuthors = {
  review?: {
    release?: {
      releaseProducer?: ReleaseAuthorLink[];
      releaseArtist?: ReleaseAuthorLink[];
      releaseDesigner?: ReleaseAuthorLink[];
    } | null;
  } | null;
};

type RegisteredAuthorLink = { authorId: string };

type UserProfileLite = { avatar: string | null };
type UserLite = {
  id: string;
  nickname: string;
  profile?: UserProfileLite | null;
  registeredAuthor?: RegisteredAuthorLink[] | null;
} | null;

type UserFavReviewRaw = {
  userId: string;
  reviewId: string;
  user?: UserLite;
};

type WithUserFavReview = {
  userFavReview?: UserFavReviewRaw[] | null;
};

class AuthorFavReview {
  @Expose()
  userId: string;

  @Expose()
  avatar: string;

  @Expose()
  nickname: string;

  @Expose()
  reviewId: string;
}

export class FindUserFavByReviewIdResponseDto {
  @Expose()
  userFavReview: UserFavReview[] = [];

  @Expose()
  @Type(() => AuthorFavReview)
  @Transform(
    ({ obj }: { obj: WithUserFavReview & ReviewWithReleaseAuthors }) => {
      const producer: ReleaseAuthorLink[] =
        obj.review?.release?.releaseProducer ?? [];
      const artists: ReleaseAuthorLink[] =
        obj.review?.release?.releaseArtist ?? [];
      const designers: ReleaseAuthorLink[] =
        obj.review?.release?.releaseDesigner ?? [];

      const releaseAuthorIds: Set<string> = new Set<string>([
        ...producer.map((x: ReleaseAuthorLink) => x.authorId),
        ...artists.map((x: ReleaseAuthorLink) => x.authorId),
        ...designers.map((x: ReleaseAuthorLink) => x.authorId),
      ]);

      const favs: UserFavReviewRaw[] = obj.userFavReview ?? [];
      const seenUsers: Set<string> = new Set<string>();
      const result: AuthorFavReview[] = [];

      for (const fav of favs) {
        const likerUserId: string = fav.userId;
        if (seenUsers.has(likerUserId)) continue;

        const user: UserLite = fav.user ?? null;
        const userAuthors: RegisteredAuthorLink[] =
          user?.registeredAuthor ?? [];

        const isAuthorOfThisRelease: boolean = userAuthors.some(
          (ra: RegisteredAuthorLink) => releaseAuthorIds.has(ra.authorId),
        );

        if (!isAuthorOfThisRelease) continue;

        result.push({
          userId: likerUserId,
          reviewId: fav.reviewId,
          nickname: user?.nickname ?? '',
          avatar: user?.profile?.avatar ?? '',
        });

        seenUsers.add(likerUserId);
      }

      return result;
    },
  )
  authorFavReview: AuthorFavReview[] = [];
}
