export interface IAlbumValue {
	rarity: {
		total: number
		rarityGenre: number
		rarityPerformance: number
	}
	integrity: {
		total: number
		formatRelease: number
		integrityGenre: number
		integritySemantic: number
	}
	depth: number
	quality: {
		total: number
		factor: number
		rhymes: number
		structure: number
		individuality: number
		styleImplementation: number
	}
	influence: {
		total: number
		multiplier: number
		releaseAnticip: number
		authorPopularity: number
	}
	totalValue: number
	release: {
		id: string
		img: string
		title: string
		authors: { id: string; name: string }[]
	}
}
