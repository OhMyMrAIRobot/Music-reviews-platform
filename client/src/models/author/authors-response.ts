import { IAuthor } from './author'

export interface IAuthorsResponse {
	count: number
	authors: IAuthor[]
}

export interface IReleaseTypeRatings {
	type: string
	ratings: {
		withoutText: number | null
		withText: number | null
		media: number | null
	}
}
