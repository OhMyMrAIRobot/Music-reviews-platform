/**
 * Minimal author representation used in nomination responses.
 */
export type NominationAuthorMeta = {
  /** Author unique identifier */
  id: string;

  /** Display name of the author */
  name: string;

  /** Avatar image filename */
  avatarImg: string;

  /** Cover image filename */
  coverImg: string;
};
