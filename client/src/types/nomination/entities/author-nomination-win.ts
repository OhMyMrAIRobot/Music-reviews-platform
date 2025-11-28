import {
	NominationAuthorMeta,
	NominationEntityKind,
	NominationReleaseMeta,
	NominationTypesEnum,
} from '..'

/**
 * Represents an author's nomination win, either for a release kind or for an author kind.
 */
export type AuthorNominationWin =
	| IAuthorNominationReleaseWin
	| IAuthorNominationAuthorWin

/**
 * An author's nomination win for a release entity.
 */
interface IAuthorNominationReleaseWin extends NominationWin {
	author?: never

	/** Release metadata */
	release: NominationReleaseMeta
}

/**
 * An author's nomination win for an author entity.
 */
interface IAuthorNominationAuthorWin extends NominationWin {
	release?: never

	/** Author metadata */
	author: NominationAuthorMeta
}

/**
 * Base nomination win structure.
 */
type NominationWin = {
	/** Nomination type id */
	nominationTypeId: string

	/** Human readable nomination type name */
	nominationType: NominationTypesEnum

	/** Year of the nomination period */
	year: number

	/** Month of the nomination period (1-12) */
	month: number

	/** Which entity kind was nominated ('author' | 'release') */
	entityKind: NominationEntityKind

	/** The id of the nominated entity (authorId or releaseId) */
	entityId: string

	/** Total number of votes received */
	votes: number
}
