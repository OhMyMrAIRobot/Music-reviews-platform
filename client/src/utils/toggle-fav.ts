/* eslint-disable @typescript-eslint/no-explicit-any */
import { runInAction } from 'mobx'

export const toggleFav = async (
	array: any[],
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
		const idx = array.findIndex(val => val.id === id)

		runInAction(() => {
			if (idx !== -1) {
				array[idx].user_fav_ids = data
				array[idx].likes_count = data.length
			}
		})

		return true
	} catch (e) {
		console.log(e)
		return false
	}
}
