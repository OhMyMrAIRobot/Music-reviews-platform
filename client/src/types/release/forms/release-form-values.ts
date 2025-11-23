export interface IMultiSelectValue {
	id: string
	name: string
}

export interface IReleaseFormValues {
	cover: File | null
	coverPreviewUrl?: string | null
	title: string
	type: string
	publishDate: string
	selectedArtists: IMultiSelectValue[]
	selectedProducers: IMultiSelectValue[]
	selectedDesigners: IMultiSelectValue[]
	deleteCover: boolean
}

export type { IMultiSelectValue as ReleaseFormMultiSelectValue }
