import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatDateCreatedAt } from 'src/users/utils/format-date-created-at';

type AdminUserWithProfile = {
  profile: { avatar?: string };
};

class AdminReviewUser {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: AdminUserWithProfile }) => obj.profile?.avatar || '',
  )
  avatar: string;

  @Exclude()
  profile?: AdminUserWithProfile;
}

class AdminReviewRelease {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  img: string;
}

export class AdminFindReviewsResponseDto {
  @Expose()
  count: number;

  @Expose()
  reviews: AdminReview[];
}

export class AdminReview {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  text: string;

  @Expose()
  @Transform(({ value }) => formatDateCreatedAt(value as Date))
  createdAt: string;

  @Expose()
  @Type(() => AdminReviewUser)
  user: AdminReviewUser;

  @Expose()
  @Type(() => AdminReviewRelease)
  release: AdminReviewRelease;
}
