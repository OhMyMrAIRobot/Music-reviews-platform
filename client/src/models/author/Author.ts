import { IReleaseTypeStats } from './AuthorsResponse'
import { IFavAuthor } from './FavAuthor'

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
