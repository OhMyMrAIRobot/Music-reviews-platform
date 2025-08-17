export interface IAuthorConfirmation {
	id: string
	confirmation: string
	createdAt: string
	user: User
	author: Author
	status: Status
}

interface User {
	id: string
	nickname: string
	avatar: string
}

interface Status {
	id: string
	status: string
}

interface Author {
	id: string
	name: string
	avatarImg: string
}
