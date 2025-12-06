import { AuthorType } from '@prisma/client';
import { ReleaseTypesEnum } from 'src/release-types/types/release-types.enum';

/**
 * Serialized author representation returned by authors endpoints.
 *
 * Includes basic identity fields, media URLs, registration flag, types,
 * per-user favorite info and aggregated nomination/rating summaries.
 */
export type AuthorDto = {
  /** Unique author id */
  id: string;

  /** Display name */
  name: string;

  /** Public avatar or empty string */
  avatar: string;

  /** Public cover or empty string */
  cover: string;

  /** Whether the author is a registered user in the system */
  isRegistered: boolean;

  /** Array of author types */
  authorTypes: AuthorType[];

  /** Per-user favorites info */
  userFavAuthor: UserFavAuthor[];

  /** Aggregated nomination statistics for the author */
  nominations: NominationInfo;

  /** Ratings grouped by release type with detailed metrics */
  releaseTypeRatings: ReleaseTypeRating[];
};

/** Relation describing a user's favourite link to an author. */
type UserFavAuthor = {
  userId: string;
  authorId: string;
};

/** Aggregated nomination counts and participations. */
type NominationInfo = {
  /** Number of nominations the author won */
  winsCount: number;
  /** Total number of nominations */
  totalCount: number;
  /** Breakdown of participations by nomination name */
  participations: {
    name: string;
    count: number;
  }[];
};

/** Rating summary for a specific release type. */
type ReleaseTypeRating = {
  /** Release type identifier */
  type: ReleaseTypesEnum;

  /** Ratings summary split by review mode */
  ratings: {
    withoutText: number | null;
    withText: number | null;
    media: number | null;
  };
};
