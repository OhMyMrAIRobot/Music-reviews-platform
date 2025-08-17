export interface IAdminReview {
	id: string
	title: string
	text: string
	createdAt: string
	user: IUser
	release: IRelease
}

interface IRelease {
	id: string
	title: string
	img: string
}

interface IUser {
	id: string
	nickname: string
	avatar: string
}
