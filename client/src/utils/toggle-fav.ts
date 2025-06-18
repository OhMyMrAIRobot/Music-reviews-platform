/* eslint-disable @typescript-eslint/no-explicit-any */
import { runInAction } from 'mobx'

export const toggleFav = async (
	item: any[] | any,
	id: string,
	isFav: boolean,
	api: {
		add: (id: string) => Promise<any>
		delete: (id: string) => Promise<any>
		fetch: (id: string) => Promise<any[]>
	}
): Promise<boolean> => {
	try {
		if (isFav) {
			await api.delete(id)
		} else {
			await api.add(id)
		}

		const data = await api.fetch(id)
		if (Array.isArray(item)) {
			const idx = item.findIndex(val => val.id === id)

			runInAction(() => {
				if (idx !== -1) {
					item[idx].user_fav_ids = data
					item[idx].likes_count = data.length
				}
			})
		} else {
			runInAction(() => {
				item.user_fav_ids = data
				item.likes_count = data.length
			})
		}

		return true
	} catch (e) {
		console.log(e)
		return false
	}
}
