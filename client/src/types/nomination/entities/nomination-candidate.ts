import { NominationEntityKind } from "..";

/**
 * Represents the union type for a nomination candidate
 * (either a release kind or an author kind).
 */
export type NominationCandidate = IReleaseCandidate | IAuthorCandidate;

/**
 * Release candidate payload returned in nomination candidate lists.
 */
interface IReleaseCandidate extends Candidate {
  entityKind: "release";

  /** Release title */
  title: string;

  /** Names of authors involved in the release */
  authors: string[];
}

/**
 * Author candidate payload returned in nomination candidate lists.
 */
interface IAuthorCandidate extends Candidate {
  entityKind: "author";

  /** Author display name */
  name: string;
}

/**
 * Base candidate representation used for nomination candidate.
 */
type Candidate = {
  /** Candidate id (authorId or releaseId) */
  id: string;

  /** Image filename associated with the candidate */
  img: string;

  /** Kind of entity: 'author' or 'release' */
  entityKind: NominationEntityKind;
};
