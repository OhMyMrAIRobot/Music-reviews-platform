import { IReleaseMediaStatus } from '../release-media-status/release-media-status'
import { IReleaseMediaType } from '../release-media-type/release-media-type'
import { IUserFavMedia } from './user-fav-media'

export interface IReleaseMedia {
	id: string
	title: string
	url: string
	createdAt: string
	releaseMediaStatus: IReleaseMediaStatus
	releaseMediaType: IReleaseMediaType
	user: IReleaseMediaUser | null
	review: IReleaseMediaReview | null
	userFavMedia: IUserFavMedia[]
	release: IReleaseMediaRelease
}

interface IReleaseMediaUser {
	id: string
	nickname: string
	points: number
	avatar: string
	position: number | null
}

interface IReleaseMediaRelease {
	id: string
	title: string
	img: string
}

interface IReleaseMediaReview {
	total: number
	rhymes: number
	structure: number
	realization: number
	individuality: number
	atmosphere: number
}
