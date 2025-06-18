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
	release_type: string
	text_count: number
	no_text_count: number
	author: IReleaseAuthor[]
	ratings: IReleaseRating[]
}
