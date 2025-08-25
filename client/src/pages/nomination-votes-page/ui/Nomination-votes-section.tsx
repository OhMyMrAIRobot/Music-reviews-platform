import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { NominationCandidate } from '../../../models/nomination/nomination-candidate/nomination-candidate'
import NominationVotesSectionItem from './Nomination-votes-section-item'

interface IProps {
	title: string
	isLoading: boolean
	candidates?: NominationCandidate[]
}

const NominationVotesSection: FC<IProps> = observer(
	({ title, candidates, isLoading }) => {
		return (
			(isLoading || (candidates && candidates.length > 0)) && (
				<div className='border-b border-white/10 pb-5'>
					<h3 className='text-lg md:text-xl font-semibold pb-2'>{title}</h3>

					<div className='grid gap-3'>
						{isLoading || !candidates
							? Array.from({ length: 5 }).map((_, idx) => (
									<NominationVotesSectionItem
										isLoading={true}
										key={`Skeleton-vote-${idx}`}
									/>
							  ))
							: candidates.map(candidate => (
									<NominationVotesSectionItem
										key={`${title}-${candidate.id}`}
										isLoading={false}
										candidate={candidate}
									/>
							  ))}
					</div>
				</div>
			)
		)
	}
)

export default NominationVotesSection
