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
