import { INominationType } from '../../types/nomination/entities/nomination-type'
import { NominationEntityKind } from './nomination-entity-kind'

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
