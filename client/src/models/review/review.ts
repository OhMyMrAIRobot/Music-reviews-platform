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
	user_id: string
	structure: number
	realization: number
	individuality: number
	atmosphere: number
	nickname: string
	profile_img: string
	points: number
	position: number | null
	release_img: string
	release_title: string
	release_id: string
	likes_count: number
	user_fav_ids: { userId: string; reviewId: string }[]
}
