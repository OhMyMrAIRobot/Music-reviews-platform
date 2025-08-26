import { NominationEntityKind } from './nomination-entity-kind'
import { INominationType } from './nomination-type/nomination-type'

export interface INominationUserVote {
	id: string
	userId: string
	nominationType: INominationType
	month: number
	year: number
	entityId: string
	entityKind: NominationEntityKind
	createdAt: Date
}
