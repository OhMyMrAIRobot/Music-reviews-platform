/**
 * Minimal release representation used in nomination responses.
 */
export type NominationReleaseMeta = {
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
