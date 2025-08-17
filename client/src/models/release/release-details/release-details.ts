import { IFavRelease } from '../fav-release'
import { IReleaseRating } from '../release-rating'
import { IReleaseRatingValues } from '../release-rating/release-rating-values'
import { IReleaseDetailsAuthor } from './release-details-author'

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
	ratingDetails: IReleaseRatingValues[]
}
