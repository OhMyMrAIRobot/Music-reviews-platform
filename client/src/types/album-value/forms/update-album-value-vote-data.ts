import { CreateAlbumValueVoteData } from "./create-album-value-vote-data";

/**
 * UpdateAlbumValueVoteData
 *
 * Partial request body for updating an album value vote.
 */
export type UpdateAlbumValueVoteData = Partial<
  Omit<CreateAlbumValueVoteData, "releaseId">
>;
