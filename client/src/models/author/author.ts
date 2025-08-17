import { IAuthorType } from './author-type/author-type'
import { IReleaseTypeRatings } from './authors-response'
import { IFavAuthor } from './fav-author'

export interface IAuthor {
	id: string
	img: string
	cover: string
	name: string
	favCount: number
	userFavAuthor: IFavAuthor[]
	authorTypes: IAuthorType[]
	isRegistered: boolean
	releaseTypeRatings: IReleaseTypeRatings[]
}
