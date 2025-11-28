import { NominationMonthWinners } from '..'

/**
 * Response shape for nomination winners across available years/months.
 */
export type NominationWinnersResponse = {
	/** Minimum year for which nomination winners data is available */
	minYear: number

	/** Maximum year for which nomination winners data is available */
	maxYear: number

	/** List of nomination winners grouped by year and month */
	items: NominationMonthWinners[]
}
