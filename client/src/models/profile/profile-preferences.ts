import { IProfilePreferenceItem } from './profile-preference-item'

export interface IProfilePreferences {
	user_id: string
	artists: IProfilePreferenceItem[] | null
	producers: IProfilePreferenceItem[] | null
	tracks: IProfilePreferenceItem[] | null
	albums: IProfilePreferenceItem[] | null
}
