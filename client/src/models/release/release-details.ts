import { IFavRelease } from './fav-release'
import { IReleaseDetailsAuthor } from './release-details-author'
import { IReleaseRating } from './release-rating'
import { IReleaseRatingDetails } from './release-rating-details'

export interface IReleaseDetails {
	id: string
	title: string
	year: number
	release_img: string
	release_type: string
	artists: IReleaseDetailsAuthor[] | null
	producers: IReleaseDetailsAuthor[] | null
	designers: IReleaseDetailsAuthor[] | null
	likes_count: number
	user_fav_ids: IFavRelease[]
	ratings: IReleaseRating[]
	rating_details: IReleaseRatingDetails[]
}
