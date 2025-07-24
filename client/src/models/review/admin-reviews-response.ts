export interface IAdminReviewsResponse {
	count: number
	reviews: IAdminReview[]
}

export interface IAdminReview {
	id: string
	title: string
	text: string
	createdAt: string
	user: {
		id: string
		nickname: string
		avatar: string
	}
	release: {
		id: string
		title: string
		img: string
	}
}
