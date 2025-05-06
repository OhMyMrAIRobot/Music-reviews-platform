export interface IAuthorsResponseDto {
	count: number
	authors: IAuthorData[]
}

export interface IAuthorData {
	id: string
	img: string
	name: string
	likes_count: number
	author_types: { type: string }[]
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
