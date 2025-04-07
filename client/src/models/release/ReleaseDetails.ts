export interface IReleaseDetails {
	id: string
	title: string
	year: number
	release_img: string
	release_type: string
	artists:
		| [
				{
					img: string
					name: string
				}
		  ]
		| null
	producers:
		| [
				{
					img: string
					name: string
				}
		  ]
		| null
	designers:
		| [
				{
					img: string
					name: string
				}
		  ]
		| null
	likes_count: number
	user_like_ids: [{ user_id: string }]
	ratings: [{ type: string; total: number }]
	rating_details: [
		{
			type: string
			details: {
				rhymes: number
				structure: number
				atmosphere: number
				realization: number
				individuality: number
				release_rating_id: string
			}
		}
	]
}
