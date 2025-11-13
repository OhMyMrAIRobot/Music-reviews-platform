import { UserFavAuthorAPI } from '../api/author/user-fav-author-api'
import { IAuthor } from '../models/author/author'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const toggleFavAuthor = async (
	author: IAuthor,
	authorId: string,
	isFav: boolean
): Promise<string[]> => {
	try {
		if (!isFav) {
			await UserFavAuthorAPI.addToFav(authorId)
		} else {
			await UserFavAuthorAPI.deleteFromFav(authorId)
		}

		const newFav = await UserFavAuthorAPI.fetchFavByAuthorId(authorId)

		author.userFavAuthor = newFav
		author.favCount = newFav.length

		return []
	} catch (e: any) {
		return Array.isArray(e.response?.data?.message)
			? e.response?.data?.message
			: [e.response?.data?.message]
	}
}
