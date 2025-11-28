import { NominationEntityKind } from 'src/nominations/types/nomination-entity-kind.type';

/**
 * Response DTO returned by the endpoint that lists nomination candidates
 * for a specific period. The DTO includes period metadata and arrays of
 * candidate groups for different nomination categories.
 */
export type FindNominationCandidatesResponseDto = {
  /** Year of the nomination period */
  year: number;

  /** Month of the nomination period (1-12) */
  month: number;

  /** Start and end dates of the nomination period in ISO format */
  startDate: string;
  endDate: string;

  /** Candidate releases for album category */
  albumCandidates: CandidateDto[];

  /** Candidate releases for single category */
  singleCandidates: CandidateDto[];

  /** Candidate items for cover category */
  coverCandidates: CandidateDto[];

  /** Candidate authors for artist category */
  artistCandidates: CandidateDto[];

  /** Candidate authors for producer category */
  producerCandidates: CandidateDto[];
};

/**
 * Union type for a nomination candidate (either a release or an author).
 */
type CandidateDto = ReleaseCandidateDto | AuthorCandidateDto;

/**
 * Release candidate payload returned in nomination candidate lists.
 */
interface ReleaseCandidateDto extends CandidateBaseDto {
  /** Release title */
  title: string;

  /** Discriminator forcing the kind to 'release' */
  entityKind: 'release';

  /** Names of authors involved in the release */
  authors: string[];
}

/**
 * Author candidate payload returned in nomination candidate lists.
 */
interface AuthorCandidateDto extends CandidateBaseDto {
  /** Author display name */
  name: string;

  /** Discriminator forcing the kind to 'author' */
  entityKind: 'author';
}

/**
 * Base candidate representation used for nomination candidate lists.
 */
interface CandidateBaseDto {
  /** Candidate id (authorId or releaseId) */
  id: string;

  /** Image filename associated with the candidate */
  img: string;

  /** Kind of entity: 'author' or 'release' */
  entityKind: NominationEntityKind;
}
