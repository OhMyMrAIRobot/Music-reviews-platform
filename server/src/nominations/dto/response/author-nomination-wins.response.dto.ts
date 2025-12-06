import { NominationTypesEnum } from 'src/nomination-types/types/nomination-types.enum';
import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

/**
 * Response returned when requesting nomination wins for a specific author.
 *
 * - `authorId` identifies the author whose nominations are returned.
 * - `nominations` contains an array of nomination items with vote counts
 *   and resolved entity payloads.
 */
export type AuthorNominationWinsResponseDto = {
  authorId: string;
  nominations: NominationItemDto[];
};

/**
 * One nomination entry for an author containing vote totals and the
 * resolved entity (author or release) for the nominated item.
 */
type NominationItemDto = {
  /** Nomination type id */
  nominationTypeId: string;

  /** Human readable nomination type name */
  nominationType: NominationTypesEnum;

  /** Year of the nomination period */
  year: number;

  /** Month of the nomination period (1-12) */
  month: number;

  /** Which entity kind was nominated ('author' | 'release') */
  entityKind: NominationEntityKind;

  /** The id of the nominated entity (authorId or releaseId) */
  entityId: string;

  /** Total number of votes received */
  votes: number;

  /** Populated when the nominated entity is an author */
  author: AuthorDto;

  /** Populated when the nominated entity is a release */
  release: ReleaseDto;
};

/**
 * Minimal author representation used in nomination responses.
 */
type AuthorDto = {
  /** Author unique identifier */
  id: string;

  /** Display name of the author */
  name: string;

  /** Avatar image filename */
  avatarImg: string;

  /** Cover image filename */
  coverImg: string;
};

/**
 * Minimal release representation used in nomination responses.
 */
type ReleaseDto = {
  /** Release unique identifier */
  id: string;

  /** Release title */
  title: string;

  /** Cover image filename */
  img: string;

  /** List of performing artists */
  artists: string[];

  /** List of producers credited on the release */
  producers: string[];

  /** List of designers credited on the release */
  designers: string[];
};
