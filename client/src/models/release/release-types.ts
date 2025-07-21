export enum ReleaseTypesEnum {
	ALBUM = 'Альбом',
	SINGLE = 'Трек',
}

export interface IReleaseType {
	id: string
	type: string
}
