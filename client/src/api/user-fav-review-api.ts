import axios from 'axios'
import { IAuthorLikesResponse } from '../models/author-likes/author-likes-response'
import { IUserFavByReviewIdResponse } from '../models/review/user-fav-by-review-id-response'
import { IUserFavReview } from '../models/review/user-fav-review'
import { api } from './api-instance'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const _api = axios.create({
	baseURL: `${SERVER_URL}/user-fav-reviews`,
	headers: {
		'Content-type': 'application/json',
	},
})

export const UserFavReviewAPI = {
	async fetchFavByReviewId(
		reviewId: string
	): Promise<IUserFavByReviewIdResponse> {
		const { data } = await _api.get<IUserFavByReviewIdResponse>(
			`/reviews/${reviewId}`
		)
		return data
	},

	async fetchAuthorLikes(
		limit: number | null,
		offset: number | null
	): Promise<IAuthorLikesResponse> {
		const { data } = await _api.get<IAuthorLikesResponse>(
			`/author-likes?
			${limit !== null ? `limit=${limit}&` : ''}
			${offset !== null ? `offset=${offset}&` : ''}
			`
		)

		return data
	},

	async addToFav(reviewId: string): Promise<IUserFavReview> {
		const { data } = await api.post<IUserFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},

	async deleteFromFav(reviewId: string): Promise<IUserFavReview> {
		const { data } = await api.delete<IUserFavReview>(
			`/user-fav-reviews/${reviewId}`
		)
		return data
	},
}
