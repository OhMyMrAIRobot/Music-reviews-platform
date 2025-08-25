import { INominationCandidate } from './nomination-candidate'

export interface INominationCandidatesResponse {
	year: number
	month: number
	startDate: string
	endDate: string

	albumCandidates: INominationCandidate[]
	singleCandidates: INominationCandidate[]
	artistCandidates: INominationCandidate[]
	designerCandidates: INominationCandidate[]
	producerCandidates: INominationCandidate[]
}
