import { SortOrdersEnum } from '../../common/enums/sort-orders-enum'
import { ReleasesSortFieldsEnum } from '../enums/releases-sort-fields-enum'
import { ReleaseSortFields, ReleaseSortKey } from './sort'

type SortMapValue = { field: ReleasesSortFieldsEnum; order: SortOrdersEnum }

export const ReleaseSortMap: Record<ReleaseSortKey, SortMapValue> = {
	PUBLISHED_NEW: {
		field: ReleasesSortFieldsEnum.PUBLISHED,
		order: SortOrdersEnum.DESC,
	},
	PUBLISHED_OLD: {
		field: ReleasesSortFieldsEnum.PUBLISHED,
		order: SortOrdersEnum.ASC,
	},
	WITHOUT_TEXT_COUNT: {
		field: ReleasesSortFieldsEnum.WITHOUT_TEXT_COUNT,
		order: SortOrdersEnum.DESC,
	},
	TEXT_COUNT: {
		field: ReleasesSortFieldsEnum.TEXT_COUNT,
		order: SortOrdersEnum.DESC,
	},
	MEDIA_RATING: {
		field: ReleasesSortFieldsEnum.MEDIA_RATING,
		order: SortOrdersEnum.DESC,
	},
	WITH_TEXT_RATING: {
		field: ReleasesSortFieldsEnum.WITH_TEXT_RATING,
		order: SortOrdersEnum.DESC,
	},
	NO_TEXT_RATING: {
		field: ReleasesSortFieldsEnum.WITHOUT_TEXT_RATING,
		order: SortOrdersEnum.DESC,
	},
	ALL_RATING: {
		field: ReleasesSortFieldsEnum.ALL_RATING,
		order: SortOrdersEnum.DESC,
	},
}

export function getSortParams(key: ReleaseSortKey) {
	return (
		ReleaseSortMap[key] ?? {
			field: ReleasesSortFieldsEnum.PUBLISHED,
			order: SortOrdersEnum.DESC,
		}
	)
}

/**
 * Find sort key by its label (value). Returns undefined if not found.
 */
export function getKeyByLabel(label: string): ReleaseSortKey | undefined {
	const entries = Object.entries(ReleaseSortFields) as [
		ReleaseSortKey,
		string
	][]
	const found = entries.find(([, v]) => v === label)
	return found ? found[0] : undefined
}
