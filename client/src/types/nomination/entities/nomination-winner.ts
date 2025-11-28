import {
	NominationAuthorMeta,
	NominationEntityKind,
	NominationReleaseMeta,
	NominationTypesEnum,
} from '..'

/**
 * Represents a winner for a specific month.
 * Union of possible winner items (author or release).
 */
export type NominationWinner =
	| IReleaseNominationWinner
	| IAuthorNominationWinner

/**
 * Winner item when the winning entity is a release.
 */
interface IReleaseNominationWinner extends Winner {
	entityKind: 'release'
	author?: never

	/** Release metadata */
	release: NominationReleaseMeta
}

/**
 * Winner item when the winning entity is an author.
 */
interface IAuthorNominationWinner extends Winner {
	entityKind: 'author'
	release?: never

	/** Author metadata */
	author: NominationAuthorMeta
}

/**
 * Shared fields for a month nomination winner entry.
 */
type Winner = {
	/** Human-readable nomination type name */
	type: NominationTypesEnum

	/** Vote count */
	votes: number

	/** Entity id (authorId or releaseId) */
	entityId: string

	/** The kind of the nominated entity (`'author' | 'release'`). */
	entityKind: NominationEntityKind
}
