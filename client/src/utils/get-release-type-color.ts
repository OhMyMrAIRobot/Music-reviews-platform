import { ReleaseTypesEnum } from '../models/release/release-type/release-types-enum'

export const getReleaseTypeColor = (type: string): string => {
	switch (type) {
		case ReleaseTypesEnum.ALBUM:
			return 'text-purple-300'
		case ReleaseTypesEnum.SINGLE:
			return 'text-green-200'
		default:
			return ''
	}
}
