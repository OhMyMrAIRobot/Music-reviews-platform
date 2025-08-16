import { IAuthorFavMedia } from './author-fav-media'
import { IUserFavMedia } from './user-fav-media'

export interface IUserFavByMediaIdResponse {
	userFavMedia: IUserFavMedia[]
	authorFavMedia: IAuthorFavMedia[]
}
