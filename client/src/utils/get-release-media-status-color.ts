import { ReleaseMediaStatusesEnum } from '../models/release/release-media/release-media-status/release-media-statuses-enum'

export const getReleaseMediaStatusColor = (status: string): string => {
	switch (status) {
		case ReleaseMediaStatusesEnum.APPROVED:
			return 'text-green-600'
		case ReleaseMediaStatusesEnum.PENDING:
			return 'text-yellow-600'
		case ReleaseMediaStatusesEnum.REJECTED:
			return 'text-red-600'
		default:
			return ''
	}
}
