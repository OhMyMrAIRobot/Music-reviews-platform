import { IAuthorFavReview } from '../user-fav-review/author-fav-review'
import { IUserFavReview } from '../user-fav-review/user-fav-review'

export interface IReleaseReview {
	id: string
	title: string
	text: string
	total: number
	rhymes: number
	structure: number
	realization: number
	individuality: number
	atmosphere: number
	createdAt: string
	userId: string
	nickname: string
	avatar: string
	points: number
	position: number | null
	favCount: number
	userFavReview: IUserFavReview[]
	authorFavReview: IAuthorFavReview[]
}
