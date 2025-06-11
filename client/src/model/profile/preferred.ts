import { IPreferredItem } from './preferred-item'

export interface IPreferred {
	user_id: string
	artists: IPreferredItem[] | null
	producers: IPreferredItem[] | null
	tracks: IPreferredItem[] | null
	albums: IPreferredItem[] | null
}
