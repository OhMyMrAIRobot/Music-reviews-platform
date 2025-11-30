import { AlbumValueTiersEnum } from '../types/album-value'
import type { SortOrder } from '../types/common/types/sort-order'

export const albumValuesKeys = {
	all: ['albumValues'] as const,
	byRelease: (releaseId: string) =>
		['albumValues', 'byRelease', { releaseId }] as const,
	list: (params: {
		limit: number
		offset: number
		order: SortOrder | undefined
		tiers: AlbumValueTiersEnum[] | undefined
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
