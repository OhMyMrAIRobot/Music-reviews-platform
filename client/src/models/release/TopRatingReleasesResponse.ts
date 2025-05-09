import { IRelease } from './Release'

export interface ITopRatingReleasesResponse {
	minYear: number
	maxYear: number
	releases: IRelease[]
}
