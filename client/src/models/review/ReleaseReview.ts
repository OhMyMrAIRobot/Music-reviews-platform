import { IFavReview } from './FavReview'

export interface IReleaseReviewResponse {
	count: number
	reviews: IReleaseReview[]
}

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
	created_at: string
	user_id: string
	nickname: string
	avatar: string
	points: number
	position: number | null
	likes_count: number
	user_fav_ids: IFavReview[]
}
