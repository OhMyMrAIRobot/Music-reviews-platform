import { NominationEntityKind } from '../nomination-entity-kind'

export interface INominationCandidate {
	id: string
	title: string
	img: string
	entityKind: NominationEntityKind
}
