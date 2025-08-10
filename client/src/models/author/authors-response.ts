import { IAuthorType } from './author-type'

export interface IAuthorsResponse {
	count: number
	authors: IAuthorData[]
}

export interface IAuthorData {
	id: string
	img: string
	name: string
	favCount: number
	authorTypes: IAuthorType[]
	releaseTypeRatings: IReleaseTypeRatings[]
	isRegistered: boolean
}

export interface IReleaseTypeRatings {
	type: string
	ratings: {
		withoutText: number | null
		withText: number | null
		media: number | null
	}
}
