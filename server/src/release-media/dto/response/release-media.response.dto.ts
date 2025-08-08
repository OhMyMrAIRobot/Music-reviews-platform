import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/shared/utils/format-full-date';

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
  @Transform(({ obj }: { obj: UserWithProfileAndRank }) => obj.profile?.avatar)
  avatar: string;

  @Expose()
  @Transform(({ obj }: { obj: UserWithProfileAndRank }) => obj.profile?.points)
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
  user: ReleaseMediaUser | null = null;

  @Expose()
  @Type(() => ReleaseMediaRelease)
  release: ReleaseMediaRelease;

  @Expose()
  @Type(() => UserFavMedia)
  userFavMedia: UserFavMedia[] = [];

  @Expose()
  @Type(() => ReleaseMediaReview)
  review: ReleaseMediaReview | null = null;

  @Expose()
  @Transform(({ value }) => formatFullDate(value as Date))
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
