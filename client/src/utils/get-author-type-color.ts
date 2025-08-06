import { AuthorTypesEnum } from '../models/author/author-types-enum'

export const getAuthorTypeColor = (type: string): string => {
	switch (type) {
		case AuthorTypesEnum.ARTIST:
			return 'text-purple-400'
		case AuthorTypesEnum.PRODUCER:
			return 'text-yellow-400'
		case AuthorTypesEnum.DESIGNER:
			return 'text-green-200'
		default:
			return ''
	}
}
