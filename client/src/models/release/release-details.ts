import { IFavRelease } from './fav-release'
import { IReleaseDetailsAuthor } from './release-details-author'
import { IReleaseRating } from './release-rating'
import { IReleaseRatingDetails } from './release-rating-details'

export interface IReleaseDetails {
	id: string
	title: string
	year: number
	img: string
	releaseType: string
	artists: IReleaseDetailsAuthor[]
	producers: IReleaseDetailsAuthor[]
	designers: IReleaseDetailsAuthor[]
	favCount: number
	userFavRelease: IFavRelease[]
	ratings: IReleaseRating[]
	ratingDetails: IReleaseRatingDetails[]
}
