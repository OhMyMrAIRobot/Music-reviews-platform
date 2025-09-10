import { Expose, Transform } from 'class-transformer';

export class AlbumValueVoteResponseDto {
  @Expose()
  releaseId: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  rarityGenre: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  rarityPerformance: number;

  @Expose()
  formatReleaseScore: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  integrityGenre: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  integritySemantic: number;

  @Expose()
  depthScore: number;

  @Expose()
  qualityRhymesImages: number;

  @Expose()
  qualityStructureRhythm: number;

  @Expose()
  qualityStyleImpl: number;

  @Expose()
  qualityIndividuality: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  influenceAuthorPopularity: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  influenceReleaseAnticip: number;

  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;
}
