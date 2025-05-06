import { makeAutoObservable, runInAction } from 'mobx'
import { AuthorAPI } from '../api/AuthorAPI'
import { ReleaseAPI } from '../api/ReleaseAPI'
import { IAuthor } from '../models/author/Author'
import { IRelease } from '../models/release/Release'

class AuthorPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	author: IAuthor | null = null
	topReleases: IRelease[] = []

	setAuthor(data: IAuthor) {
		this.author = data
	}

	setTopReleases(data: IRelease[]) {
		this.topReleases = data
	}

	fetchAuthorById = async (id: string) => {
		try {
			const data = await AuthorAPI.fetchAuthorById(id)
			this.setAuthor(data)
		} catch (e) {
			console.log(e)
		}
	}

	fetchTopReleases = async (authorId: string) => {
		try {
			const data = await ReleaseAPI.fetchAuthorTopReleases(authorId)
			console.log(data)
			this.setTopReleases(data)
		} catch (e) {
			console.log(e)
		}
	}

	toggleFavAuthor = async (
		authorId: string,
		isFav: boolean
	): Promise<{ status: boolean; message: string }> => {
		try {
			if (isFav) {
				await AuthorAPI.deleteFavAuthor(authorId)
			} else {
				await AuthorAPI.addFavAuthor(authorId)
			}

			const data = await AuthorAPI.fetchFavAuthorUsersIds(authorId)

			runInAction(() => {
				if (this.author) {
					this.author.user_fav_ids = data
					this.author.likes_count = data.length
				}
			})

			return {
				status: true,
				message: isFav
					? 'Вы убрали автора из списка понравившихся'
					: 'Вы отметили автора как понравившегося!',
			}
		} catch (e) {
			console.log(e)
			return {
				status: false,
				message: isFav
					? 'Не удалось убрать автора из списка понравившихся!'
					: 'Не удалось отметить автора как понравившегося!',
			}
		}
	}
}

export default new AuthorPageStore()
