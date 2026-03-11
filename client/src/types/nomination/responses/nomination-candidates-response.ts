import { NominationCandidate } from '..';

/**
 * Response returned by the endpoint that lists nomination candidates
 * for a specific period. The response includes period metadata and arrays of
 * candidate groups for different nomination categories.
 */
export type NominationCandidatesResponse = {
  /** Year of the nomination period */
  year: number;

  /** Month of the nomination period (1-12) */
  month: number;

  /** Start and end dates of the nomination period in ISO format */
  startDate: string;
  endDate: string;

  /** Candidate releases for album category */
  albumCandidates: NominationCandidate[];

  /** Candidate releases for single category */
  singleCandidates: NominationCandidate[];

  /** Candidate items for cover category */
  coverCandidates: NominationCandidate[];

  /** Candidate authors for artist category */
  artistCandidates: NominationCandidate[];

  /** Candidate authors for producer category */
  producerCandidates: NominationCandidate[];
};
