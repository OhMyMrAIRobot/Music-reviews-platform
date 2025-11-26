import { Expose, Transform } from 'class-transformer';

export class AlbumValueVoteResponseDto {
  /** The id of the release that was evaluated. */
  @Expose()
  releaseId: string;

  /** Rarity score for the genre (numeric). */
  @Expose()
  @Transform(({ value }: { value: string }) => Number(value))
  rarityGenre: number;

  /** Rarity score for the performance format (numeric). */
  @Expose()
  @Transform(({ value }: { value: string }) => Number(value))
  rarityPerformance: number;

  /** Format release score (small integer flag). */
  @Expose()
  formatReleaseScore: number;

  /** Genre integrity rating (numeric). */
  @Expose()
  @Transform(({ value }: { value: string }) => Number(value))
  integrityGenre: number;

  /** Semantic integrity rating (numeric). */
  @Expose()
  @Transform(({ value }: { value: string }) => Number(value))
  integritySemantic: number;

  /** Depth score (integer). */
  @Expose()
  depthScore: number;

  /** Quality of rhymes/images (integer). */
  @Expose()
  qualityRhymesImages: number;

  /** Structure/rhythm quality (integer). */
  @Expose()
  qualityStructureRhythm: number;

  /** Style implementation quality (integer). */
  @Expose()
  qualityStyleImpl: number;

  /** Individuality/charisma score (integer). */
  @Expose()
  qualityIndividuality: number;

  /** Influence / author popularity (numeric). */
  @Expose()
  @Transform(({ value }: { value: string }) => Number(value))
  influenceAuthorPopularity: number;

  /** Influence / release anticipation (numeric). */
  @Expose()
  @Transform(({ value }: { value: string }) => Number(value))
  influenceReleaseAnticip: number;

  /** Vote unique identifier. */
  @Expose()
  id: string;

  /** Author (user) id who created the vote. */
  @Expose()
  userId: string;

  /** ISO timestamp when the vote was created. */
  @Expose()
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: string;
}
