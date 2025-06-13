import { IAuthorType } from './author-type'

export interface IAuthorsResponse {
	count: number
	authors: IAuthorData[]
}

export interface IAuthorData {
	id: string
	img: string
	name: string
	likes_count: number
	author_types: IAuthorType[]
	release_type_stats: IReleaseTypeStats[]
}

export interface IReleaseTypeStats {
	type: string
	ratings: {
		no_text: number | null
		with_text: number | null
		super_user: number | null
	}
}
