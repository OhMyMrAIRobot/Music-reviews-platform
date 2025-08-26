import { NominationEntityKind } from '../nomination-entity-kind'

export type INominationWinnerParticipationItem =
	| INominationWinnerParticipationRelease
	| INominationWinnerParticipationAuthor

interface INominationWinnerParticipationRelease
	extends INominationWinnerParticipationItemBase {
	release: IRelease
	author?: never
}

interface INominationWinnerParticipationAuthor
	extends INominationWinnerParticipationItemBase {
	author: IAuthor
	release?: never
}

interface INominationWinnerParticipationItemBase {
	nominationTypeId: string
	nominationType: string
	year: number
	month: number
	entityKind: NominationEntityKind
	entityId: string
	votes: number
}

interface IAuthor {
	id: string
	name: string
	avatarImg: string
	coverImg: string
}

interface IRelease {
	id: string
	title: string
	img: string
	artists: string[]
	producers: string[]
	designers: string[]
}
