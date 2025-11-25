import axios from 'axios'
import {
	AuthorLikesQuery,
	AuthorLikesResponse,
	UserFavReview,
} from '../../types/review'
import { api } from '../api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export const UserFavReviewAPI = {
	async findAuthorLikes(query: AuthorLikesQuery): Promise<AuthorLikesResponse> {
		const { data } = await axios.get<AuthorLikesResponse>(
			`${SERVER_URL}/user-fav-reviews/author-likes?
			${query.limit ? `limit=${query.limit}&` : ''}
			${query.offset ? `offset=${query.offset}` : ''}`
		)

		return data
	},

	async addToFav(reviewId: string): Promise<UserFavReview> {
		const { data } = await api.post<UserFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},

	async deleteFromFav(reviewId: string): Promise<UserFavReview> {
		const { data } = await api.delete<UserFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},
}
