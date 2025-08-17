import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/shared/utils/format-full-date';

type ReleaseAuthorLink = { authorId: string };
type ReleaseWithAuthors = {
  release?: {
    releaseProducer?: ReleaseAuthorLink[];
    releaseArtist?: ReleaseAuthorLink[];
    releaseDesigner?: ReleaseAuthorLink[];
  } | null;
};

type RegisteredAuthorLink = { authorId: string };
type UserProfileLite = { avatar: string };
type UserLite = {
  id: string;
  nickname: string;
  profile?: UserProfileLite | null;
  registeredAuthor?: RegisteredAuthorLink[] | null;
} | null;

type UserFavMediaRaw = {
  userId: string;
  mediaId: string;
  user?: UserLite;
};

type WithUserFavMedia = {
  userFavMedia?: UserFavMediaRaw[] | null;
};

type UserWithProfileAndRank = {
  profile: {
    points: number;
    avatar: string;
  } | null;
  topUsersLeaderboard: {
    rank: number;
  } | null;
};

class ReleaseMediaStatus {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

class ReleaseMediaType {
  @Expose()
  id: string;

  @Expose()
  type: string;
}

class ReleaseMediaUser {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: UserWithProfileAndRank }) => obj.profile?.avatar ?? '',
  )
  avatar: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: UserWithProfileAndRank }) => obj.profile?.points ?? 0,
  )
  points: number;

  @Expose()
  @Transform(
    ({ obj }: { obj: UserWithProfileAndRank }) =>
      obj.topUsersLeaderboard?.rank ?? null,
  )
  position: number | null;
}

class ReleaseMediaReview {
  @Expose()
  total: number;

  @Expose()
  rhymes: number;

  @Expose()
  structure: number;

  @Expose()
  realization: number;

  @Expose()
  individuality: number;

  @Expose()
  atmosphere: number;
}

class ReleaseMediaRelease {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  img: string;
}

class UserFavMedia {
  @Expose()
  mediaId: string;

  @Expose()
  userId: string;
}

class AuthorFavMedia {
  @Expose()
  mediaId: string;

  @Expose()
  userId: string;

  @Expose()
  nickname: string;

  @Expose()
  avatar: string;
}

export class ReleaseMediaResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  url: string;

  @Expose()
  @Type(() => ReleaseMediaStatus)
  releaseMediaStatus: ReleaseMediaStatus;

  @Expose()
  @Type(() => ReleaseMediaType)
  releaseMediaType: ReleaseMediaType;

  @Expose()
  @Type(() => ReleaseMediaUser)
  user: ReleaseMediaUser | null;

  @Expose()
  @Type(() => ReleaseMediaRelease)
  release: ReleaseMediaRelease;

  @Expose()
  @Type(() => UserFavMedia)
  userFavMedia: UserFavMedia[] = [];

  @Expose()
  @Type(() => ReleaseMediaReview)
  review: ReleaseMediaReview | null;

  @Expose()
  @Type(() => AuthorFavMedia)
  @Transform(({ obj }: { obj: ReleaseWithAuthors & WithUserFavMedia }) => {
    const producer: ReleaseAuthorLink[] = obj.release?.releaseProducer ?? [];
    const artists: ReleaseAuthorLink[] = obj.release?.releaseArtist ?? [];
    const designers: ReleaseAuthorLink[] = obj.release?.releaseDesigner ?? [];

    const releaseAuthorIds: Set<string> = new Set<string>([
      ...producer.map((x: ReleaseAuthorLink) => x.authorId),
      ...artists.map((x: ReleaseAuthorLink) => x.authorId),
      ...designers.map((x: ReleaseAuthorLink) => x.authorId),
    ]);

    const favs: UserFavMediaRaw[] = obj.userFavMedia ?? [];
    const seenUsers: Set<string> = new Set<string>();

    const result: AuthorFavMedia[] = [];

    for (const fav of favs) {
      const likerUserId: string = fav.userId;
      if (seenUsers.has(likerUserId)) continue;

      const user: UserLite = fav.user ?? null;
      const userAuthors: RegisteredAuthorLink[] = user?.registeredAuthor ?? [];

      const matched: RegisteredAuthorLink | undefined = userAuthors.find(
        (ra: RegisteredAuthorLink) => releaseAuthorIds.has(ra.authorId),
      );

      if (!matched) continue;

      result.push({
        mediaId: fav.mediaId,
        userId: likerUserId,
        nickname: user?.nickname ?? '',
        avatar: user?.profile?.avatar ?? '',
      });

      seenUsers.add(likerUserId);
    }

    return result;
  })
  authorFavMedia: AuthorFavMedia[] = [];

  @Expose()
  @Transform(({ value }: { value: Date }) => formatFullDate(value))
  createdAt: string;

  @Exclude()
  releaseId: string;

  @Exclude()
  userId: string;

  @Exclude()
  releaseMediaTypeId: string;

  @Exclude()
  releaseMediaStatusId: string;
}
