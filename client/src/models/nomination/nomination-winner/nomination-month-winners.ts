import { NominationWinner } from './nomination-winner'

export interface INominationMonthWinners {
	year: number
	month: number
	results: NominationWinner[]
}
