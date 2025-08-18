import { IAuthorNominationWinner } from './author-nomination-winner'
import { IReleaseNominationWinner } from './release-nomination-winner'

export type INominationWinner =
	| IReleaseNominationWinner
	| IAuthorNominationWinner
