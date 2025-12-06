/**
 * Represents the album value entity.
 */
export type AlbumValue = {
	/** Rarity-related scores and their aggregated total. */
	rarity: {
		total: number
		rarityGenre: number
		rarityPerformance: number
	}
	/** Integrity-related scores (format + semantic/genre integrity). */
	integrity: {
		total: number
		formatRelease: number
		integrityGenre: number
		integritySemantic: number
	}
	/** Depth score describing musical/lyrical depth. */
	depth: number
	/** Quality-related breakdown and aggregated score. */
	quality: {
		total: number
		factor: number
		rhymes: number
		structure: number
		individuality: number
		styleImplementation: number
	}
	/** Influence-related values including multiplier used in final formula. */
	influence: {
		total: number
		multiplier: number
		releaseAnticip: number
		authorPopularity: number
	}
	/** Final aggregated numeric value assigned to the album. */
	totalValue: number
	/** Minimal release metadata included with the computed value. */
	release: Release
}

/**
 * Minimal release representation included on the album value meta.
 */
type Release = {
	id: string
	img: string
	title: string
	authors: Author[]
}

/**
 * Minimal author representation included on the release meta.
 */
type Author = {
	id: string
	name: string
	img: string
}
