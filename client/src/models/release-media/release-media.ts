import { IReleaseMediaStatus } from '../release-media-status/release-media-status'
import { IReleaseMediaType } from '../release-media-type/release-media-type'

export interface IReleaseMedia {
	id: string
	title: string
	url: string
	createdAt: string
	releaseMediaStatus: IReleaseMediaStatus
	releaseMediaType: IReleaseMediaType
	user: IReleaseMediaUser | null
	release: IReleaseMediaRelease
}

interface IReleaseMediaUser {
	id: string
	nickname: string
}

interface IReleaseMediaRelease {
	id: string
	title: string
	img: string
}
