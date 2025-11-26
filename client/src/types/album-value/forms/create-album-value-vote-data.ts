/**
 * CreateAlbumValueVoteData
 *
 * Request body for creating an album value vote.
 */
export type CreateAlbumValueVoteData = {
	releaseId: string
	rarityGenre: number
	rarityPerformance: number
	formatReleaseScore: number
	integrityGenre: number
	integritySemantic: number
	depthScore: number
	qualityRhymesImages: number
	qualityStructureRhythm: number
	qualityStyleImpl: number
	qualityIndividuality: number
	influenceAuthorPopularity: number
	influenceReleaseAnticip: number
}
