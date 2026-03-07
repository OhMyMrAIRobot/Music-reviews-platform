/**
 * Represents an album value vote.
 */
export type AlbumValueVote = {
  /** Vote unique identifier. */
  id: string;

  /** The id of the release that was evaluated. */
  releaseId: string;

  /** Author (user) id who created the vote. */
  userId: string;

  /** ISO timestamp when the vote was created. */
  createdAt: string;

  /** Rarity score for the genre (numeric). */
  rarityGenre: number;

  /** Rarity score for the performance format (numeric). */
  rarityPerformance: number;

  /** Format release score (small integer flag). */
  formatReleaseScore: number;

  /** Genre integrity rating (numeric). */
  integrityGenre: number;

  /** Semantic integrity rating (numeric). */
  integritySemantic: number;

  /** Depth score (integer). */
  depthScore: number;

  /** Quality of rhymes/images (integer). */
  qualityRhymesImages: number;

  /** Structure/rhythm quality (integer). */
  qualityStructureRhythm: number;

  /** Style implementation quality (integer). */
  qualityStyleImpl: number;

  /** Individuality/charisma score (integer). */
  qualityIndividuality: number;

  /** Influence / author popularity (numeric). */
  influenceAuthorPopularity: number;

  /** Influence / release anticipation (numeric). */
  influenceReleaseAnticip: number;
};
