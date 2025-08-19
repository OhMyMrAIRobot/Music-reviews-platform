import { INominationMonthWinners } from './nomination-month-winners'

export interface INominationWinnersResponse {
	minYear: number
	maxYear: number
	items: INominationMonthWinners[]
}
