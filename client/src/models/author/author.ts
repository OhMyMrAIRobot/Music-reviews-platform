import { AuthorType } from '../../types/author'
import { IReleaseTypeRatings } from './authors-response'
import { IFavAuthor } from './fav-author'

export interface IAuthor {
	id: string
	img: string
	cover: string
	name: string
	favCount: number
	userFavAuthor: IFavAuthor[]
	authorTypes: AuthorType[]
	isRegistered: boolean
	releaseTypeRatings: IReleaseTypeRatings[]
	nominationsCount: number
	winsCount: number
	nominationParticipations: {
		name: string
		count: number
	}[]
}
