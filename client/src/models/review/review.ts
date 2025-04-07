export interface IReview {
	id: string
	title: string
	text: string
	total: number
	rhymes: number
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
	likes_count: number
	like_user_ids: [
		{
			user_id: string | null
		}
	]
}
