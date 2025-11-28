import { NominationWinner } from '..'

/**
 * Represents the list of winners for a specific month.
 */
export type NominationMonthWinners = {
	/** Year of the nomination period */
	year: number

	/** Month of the nomination period (1-12) */
	month: number

	/** List of winners for the specified month */
	results: NominationWinner[]
}
