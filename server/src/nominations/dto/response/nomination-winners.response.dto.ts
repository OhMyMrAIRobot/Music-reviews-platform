import { NominationTypesEnum } from 'src/nomination-types/types/nomination-types.enum';
import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

/**
 * Response shape for nomination winners across available years/months.
 */
export type NominationWinnersResponseDto = {
  /** Minimum year for which nomination winners data is available */
  minYear: number;

  /** Maximum year for which nomination winners data is available */
  maxYear: number;

  /** List of nomination winners grouped by year and month */
  items: NominationMonthWinnerItemDto[];
};

/**
 * Winners for a specific month.
 */
export type NominationMonthWinnerItemDto = {
  year: number;
  month: number;
  results: NominationWinnerItemDto[];
};

/**
 * Union of possible winner items (author or release).
 */
type NominationWinnerItemDto = AuthorWinnerItemDto | ReleaseWinnerItemDto;

/**
 * Winner item when the winning entity is an author.
 */
interface AuthorWinnerItemDto extends NominationWinnerBaseDto {
  entityKind: 'author';
  author: NominationAuthorDto;
  release?: never;
}

/**
 * Winner item when the winning entity is a release.
 */
interface ReleaseWinnerItemDto extends NominationWinnerBaseDto {
  entityKind: 'release';
  release: NominationReleaseDto;
  author?: never;
}

/**
 * Minimal author payload used for nomination winners responses.
 */
type NominationAuthorDto = {
  id: string;
  name: string;
  avatarImg: string;
  coverImg: string;
};

/**
 * Minimal release payload used for nomination winners responses.
 */
type NominationReleaseDto = {
  id: string;
  title: string;
  img: string;
  artists: string[];
  producers: string[];
  designers: string[];
};

/**
 * Shared fields for a nomination winner entry.
 */
type NominationWinnerBaseDto = {
  /** Nomination type name */
  type: NominationTypesEnum;

  /** Vote count */
  votes: number;

  /** Entity id (authorId or releaseId) */
  entityId: string;

  /** Entity kind discriminator */
  entityKind: NominationEntityKind;
};
