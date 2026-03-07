import { NominationType } from ".";
import { NominationEntityKind } from "../subtypes";

/**
 * Data returned when a user's vote for a nomination is requested.
 */
export type NominationUserVote = {
  /** Unique identifier of the vote */
  id: string;

  /** The id of the user who cast the vote */
  userId: string;

  /** The type of nomination. */
  nominationType: NominationType;

  /** Month when the vote was cast */
  month: number;

  /** Year when the vote was cast */
  year: number;

  /** The id of the nominated entity (authorId or releaseId). */
  entityId: string;

  /** The kind of the nominated entity (`'author' | 'release'`). */
  entityKind: NominationEntityKind;

  /** ISO timestamp when the vote was created */
  createdAt: string;
};
