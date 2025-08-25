import { NominationEntityKind } from '../nomination-entity-kind'

export type NominationWinner =
	| IReleaseNominationWinner
	| IAuthorNominationWinner

interface INominationWinnerBase {
	type: string
	votes: number
	entityId: string
	entityKind: NominationEntityKind
}

interface IReleaseNominationWinner extends INominationWinnerBase {
	entityKind: 'release'
	release: IRelease
	author?: never
}

interface IAuthorNominationWinner extends INominationWinnerBase {
	entityKind: 'author'
	author: IAuthor
	release?: never
}

interface IRelease {
	id: string
	title: string
	img: string
	artists: string[]
	producers: string[]
	designers: string[]
}

interface IAuthor {
	id: string
	name: string
	avatarImg: string
	coverImg: string
}
