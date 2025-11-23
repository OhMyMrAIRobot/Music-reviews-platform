import { ReviewsResponseDto } from '../dto/response/reviews.response.dto';

/**
 * ReviewRawQueryResponseDto
 *
 * Wrapper type describing the JSON object returned by the raw SQL
 * aggregator used by `ReviewsService`. The `result` field contains the
 * standardized `ReviewsResponseDto` with `items` and `meta`.
 */
export type ReviewRawQueryResponseDto = {
  result: ReviewsResponseDto;
};

/** Array form returned by Prisma's `$queryRaw` for this query. */
export type ReviewRawQueryArrayResponseDto = Array<ReviewRawQueryResponseDto>;
