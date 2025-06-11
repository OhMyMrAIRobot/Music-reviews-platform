import { IReleaseTypeStats } from './authors-response'
import { IFavAuthor } from './fav-author'

export interface IAuthor {
	id: string
	img: string
	cover: string
	name: string
	likes_count: number
	user_fav_ids: IFavAuthor[]
	author_types: { type: string }[]
	release_type_stats: IReleaseTypeStats[]
}
