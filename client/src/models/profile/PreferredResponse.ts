import { IPreferredItem } from './PreferredItem'

export interface IPreferredResponse {
	user_id: string
	artists: IPreferredItem[] | null
	producers: IPreferredItem[] | null
	tracks: IPreferredItem[] | null
	albums: IPreferredItem[] | null
}
