import { IPreferredItem } from './PreferredItem'

export interface IPreferredResponse {
	user_id: string
	artists: IPreferredItem[]
	producers: IPreferredItem[]
	tracks: IPreferredItem[]
	albums: IPreferredItem[]
}
