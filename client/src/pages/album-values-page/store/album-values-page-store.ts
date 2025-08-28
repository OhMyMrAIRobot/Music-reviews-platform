import { makeAutoObservable } from 'mobx'
import { AlbumValueAPI } from '../../../api/album-value-api'
import { IAlbumValue } from '../../../models/album-value/album-value'
import { AlbumValuesEnum } from '../../../models/album-value/album-value-enum'
import { SortOrder } from '../../../types/sort-order-type'

class AlbumValuesPageStore {
	constructor() {
		makeAutoObservable(this)
	}

	values: IAlbumValue[] = []
	count: number = 0

	setValues(data: IAlbumValue[]) {
		this.values = data
	}

	setCount(data: number) {
		this.count = data
	}

	fetchAlbumValues = async (
		limit: number | null,
		offset: number | null,
		order: SortOrder | null,
		tiers: AlbumValuesEnum[] | null
	) => {
		try {
			const data = await AlbumValueAPI.fetchAlbumValues(
				limit,
				offset,
				order,
				tiers
			)
			this.setValues(data.values)
			this.setCount(data.count)
		} catch {
			this.setValues([])
			this.setCount(0)
		}
	}
}

export default new AlbumValuesPageStore()
