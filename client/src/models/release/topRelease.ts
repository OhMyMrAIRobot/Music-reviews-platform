export interface ITopRelease {
	id: string
	title: string
	img: string
	release_type: string
	review_count: number
	author: [{ name: string }]
	ratings: [{ type: string; total: number }]
}
