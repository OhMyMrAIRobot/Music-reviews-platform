import { Expose, Transform } from 'class-transformer';
import { formatDateCreatedAt } from 'src/users/utils/format-date-created-at';

class AdminReviewUser {
  @Expose()
  id: string;

  @Expose()
  nickname: string;
}

class AdminReviewRelease {
  @Expose()
  id: string;

  @Expose()
  title: string;
}

export class AdminFindReviewsResponseDto {
  count: number;
  reviews: AdminReview[];
}

export class AdminReview {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  text: string;

  @Transform(({ value }) => formatDateCreatedAt(value as Date))
  createdAt: string;

  @Expose()
  user: AdminReviewUser;

  @Expose()
  release: AdminReviewRelease;
}
