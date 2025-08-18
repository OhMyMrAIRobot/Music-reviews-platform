import { INominationWinner } from './nomination-winner'

export interface INominationWinnersResponse {
	year: number
	month: number
	results: INominationWinner[]
}
