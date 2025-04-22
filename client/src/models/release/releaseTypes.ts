export enum ReleaseTypesEnum {
	ALBUM = 'Альбом',
	SINGLE = 'Трек',
	MULTISINGLE = 'Мультитрек',
}

export interface IReleaseType {
	id: string
	type: string
}
