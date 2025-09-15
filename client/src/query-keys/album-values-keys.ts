import type { AlbumValueTiersEnum } from '../models/album-value/album-value-tiers-enum'
import type { SortOrder } from '../types/sort-order-type'

export const albumValuesKeys = {
	all: ['albumValues'] as const,
	list: (params: {
		limit: number
		offset: number
		order: SortOrder | null
		tiers: AlbumValueTiersEnum[] | null
		authorId?: string | null
		releaseId?: string | null
	}) => {
		const normalizedTiers = params.tiers ? [...params.tiers].sort() : null

		return [
			'albumValues',
			{
				limit: params.limit,
				offset: params.offset,
				order: params.order ?? null,
				tiers: normalizedTiers,
				authorId: params.authorId ?? null,
				releaseId: params.releaseId ?? null,
			},
		] as const
	},
}
