import { INominationWinner } from './nomination-winner'

export interface INominationMonthWinners {
	year: number
	month: number
	results: INominationWinner[]
}
