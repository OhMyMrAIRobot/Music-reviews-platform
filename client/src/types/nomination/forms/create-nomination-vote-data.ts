import { NominationEntityKind } from '..';

/**
 * Represents data for creating the user's nomination vote request.
 */
export type CreateNominationVoteData = {
  /**
   * Nomination type id.
   * Must be a valid entity id string.
   */
  nominationTypeId: string;

  /**
   * Which entity kind is being voted for: 'author' or 'release'.
   */
  entityKind: NominationEntityKind;

  /**
   * The id of the voted entity. Must be a valid entity id.
   */
  entityId: string;
};
