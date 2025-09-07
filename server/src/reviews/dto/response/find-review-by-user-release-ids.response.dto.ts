import { Expose } from 'class-transformer';

export class FindReviewByUserReleaseIdsResponseDto {
  @Expose()
  id: string;

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

  @Expose()
  total: number;

  @Expose()
  title: string | null;

  @Expose()
  text: string | null;
}
