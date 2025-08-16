import { IAuthorFavReview } from './author-fav-review'
import { IUserFavReview } from './user-fav-review'

export interface IUserFavByReviewIdResponse {
	userFavReview: IUserFavReview[]
	authorFavReview: IAuthorFavReview[]
}
