import { NominationEntityKind } from '../nomination-entity-kind'

export type NominationCandidate = IReleaseCandidateDto | IAuthorCandidateDto

interface ICandidateBaseDto {
	id: string
	img: string
	entityKind: NominationEntityKind
}

interface IReleaseCandidateDto extends ICandidateBaseDto {
	title: string
	entityKind: 'release'
	authors: string[]
}

interface IAuthorCandidateDto extends ICandidateBaseDto {
	name: string
	entityKind: 'author'
}
