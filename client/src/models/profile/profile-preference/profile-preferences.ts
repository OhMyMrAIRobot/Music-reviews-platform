import { IProfilePreference } from './profile-preference-item'

export interface IProfilePreferences {
	userId: string
	artists: IProfilePreference[] | null
	producers: IProfilePreference[] | null
	tracks: IProfilePreference[] | null
	albums: IProfilePreference[] | null
}
