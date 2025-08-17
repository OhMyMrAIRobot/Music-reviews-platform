import { IAdminRelease } from './admin-release'

export interface IAdminReleasesResponse {
	count: number
	releases: IAdminRelease[]
}
