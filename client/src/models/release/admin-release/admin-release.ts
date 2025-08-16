import { IReleaseType } from '../release-type/release-type'

export interface IAdminRelease {
	id: string
	title: string
	publishDate: string
	img: string
	releaseType: IReleaseType
	releaseArtists: IAdminReleaseAuthor[]
	releaseProducers: IAdminReleaseAuthor[]
	releaseDesigners: IAdminReleaseAuthor[]
}

interface IAdminReleaseAuthor {
	id: string
	name: string
}
