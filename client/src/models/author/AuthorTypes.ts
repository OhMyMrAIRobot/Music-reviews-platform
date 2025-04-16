export enum AuthorTypesEnum {
	PRODUCER = 'Продюссер',
	ARTIST = 'Артист',
	DESIGNER = 'Дизайнер',
}

export interface IAuthorType {
	id: string
	type: string
}
