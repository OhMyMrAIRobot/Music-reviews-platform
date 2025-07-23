import { ReleaseTypesEnum } from '../models/release/release-types'

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
