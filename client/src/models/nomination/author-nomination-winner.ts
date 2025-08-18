import { INominationWinnerBase } from './nomination-winner-base'

export interface IAuthorNominationWinner extends INominationWinnerBase {
	entityKind: 'author'
	author: IAuthor
	release?: never
}

interface IAuthor {
	id: string
	name: string
	avatarImg: string
	coverImg: string
}
