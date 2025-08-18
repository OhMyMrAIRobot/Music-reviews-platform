import { NominationEntityKind } from './nomination-entity-kind'

export interface INominationWinnerBase {
	type: string
	votes: number
	entityId: string
	entityKind: NominationEntityKind
}
