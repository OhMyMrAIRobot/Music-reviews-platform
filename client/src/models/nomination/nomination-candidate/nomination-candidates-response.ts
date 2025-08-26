import { NominationCandidate } from './nomination-candidate'

export interface INominationCandidatesResponse {
	year: number
	month: number
	startDate: string
	endDate: string

	albumCandidates: NominationCandidate[]
	singleCandidates: NominationCandidate[]
	coverCandidates: NominationCandidate[]
	artistCandidates: NominationCandidate[]
	producerCandidates: NominationCandidate[]
}
