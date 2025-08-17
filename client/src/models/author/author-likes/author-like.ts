export interface IAuthorLike {
	reviewAuthor: IUser
	author: IUser
	release: IRelease
	reviewTitle: string
}

interface IUser {
	id: string
	nickname: string
	avatar: string
}

interface IRelease {
	id: string
	title: string
	img: string
}
