import { IAuthorType } from '../author/author-type'

export interface IProfile {
	id: string
	nickname: string
	createdAt: string
	bio: string | null
	avatar: string
	cover: string
	points: number
	position: number | null
	role: string
	textCount: number
	withoutTextCount: number
	receivedLikes: number
	givenLikes: number
	social: { id: string; url: string; name: string }[]
	isAuthor: boolean
	authorTypes: IAuthorType[]
	authorCommentsCount: number
	receivedAuthorLikes: number
	givenAuthorLikes: number
}
