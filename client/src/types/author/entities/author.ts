import { AuthorType, UserFavAuthor } from ".";
import { AuthorNominations, AuthorReleaseTypeRating } from "../subtypes";

/**
 * Represents an author entity.
 */
export type Author = {
  id: string;

  /** Display name */
  name: string;

  /** Public avatar URL or empty string */
  avatar: string;

  /** Public cover URL or empty string */
  cover: string;

  /** Whether the author is a registered user in the system */
  isRegistered: boolean;

  /** Array of author types */
  authorTypes: AuthorType[];

  /** Per-user favorites info */
  userFavAuthor: UserFavAuthor[];

  /** Aggregated nomination statistics for the author */
  nominations: AuthorNominations;

  /** Ratings grouped by release type with detailed metrics */
  releaseTypeRatings: AuthorReleaseTypeRating[];
};
