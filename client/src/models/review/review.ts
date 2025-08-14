import { IAuthorFavReview } from './author-fav-review'
import { IUserFavReview } from './user-fav-review'

export interface IReviewsResponse {
	count: number
	reviews: IReview[]
}

export interface IReview {
	id: string
	title: string
	text: string
	total: number
	rhymes: number
	userId: string
	structure: number
	realization: number
	individuality: number
	atmosphere: number
	nickname: string
	profileImg: string
	points: number
	position: number | null
	releaseImg: string
	releaseTitle: string
	releaseId: string
	favCount: number
	userFavReview: IUserFavReview[]
	authorFavReview: IAuthorFavReview[]
}
