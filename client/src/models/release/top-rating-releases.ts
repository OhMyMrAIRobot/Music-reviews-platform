import { IRelease } from './release'

export interface ITopRatingReleases {
	minYear: number
	maxYear: number
	releases: IRelease[]
}
