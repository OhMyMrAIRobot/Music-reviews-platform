/**
 * Aggregated information about author's
 * nomination counts and participations.
 * */
export type AuthorNominations = {
  /** Number of nominations the author won */
  winsCount: number;

  /** Total number of nominations */
  totalCount: number;

  /** Breakdown of participations by nomination name */
  participations: {
    name: string;
    count: number;
  }[];
};
