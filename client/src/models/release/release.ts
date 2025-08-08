import { IReleaseAuthor } from './release-author'
import { IReleaseRating } from './release-rating'

export interface IReleaseResponse {
	count: number
	releases: IRelease[]
}

export interface IRelease {
	id: string
	title: string
	img: string
	releaseType: string
	textCount: number
	withoutTextCount: number
	authors: IReleaseAuthor[]
	ratings: IReleaseRating[]
}
