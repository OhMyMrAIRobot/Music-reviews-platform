import { INominationWinnerBase } from './nomination-winner-base'

export interface IReleaseNominationWinner extends INominationWinnerBase {
	entityKind: 'release'
	release: IRelease
	author?: never
}

interface IRelease {
	id: string
	title: string
	img: string
	authors: string[]
}
