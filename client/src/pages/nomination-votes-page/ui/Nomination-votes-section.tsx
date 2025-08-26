import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useStore } from '../../../hooks/use-store'
import { NominationCandidate } from '../../../models/nomination/nomination-candidate/nomination-candidate'
import { INominationType } from '../../../models/nomination/nomination-type/nomination-type'
import NominationVotesSectionItem from './Nomination-votes-section-item'

interface IProps {
	title: string
	isLoading: boolean
	candidates?: NominationCandidate[]
	nominationType?: INominationType
}

const NominationVotesSection: FC<IProps> = observer(
	({ title, candidates, isLoading, nominationType }) => {
		const { nominationVotesPageStore } = useStore()

		const [voted, setVoted] = useState<boolean>(false)

		useEffect(() => {
			let voted = false
			if (nominationType) {
				voted = nominationVotesPageStore.userVotes.some(
					v => v.nominationType.type === nominationType.type
				)
			}
			setVoted(voted)
		}, [nominationType, nominationVotesPageStore.userVotes])

		return (
			(isLoading || (candidates && candidates.length > 0)) && (
				<div className='border-b border-white/10 pb-5'>
					<h3 className='text-lg md:text-xl font-semibold pb-2'>{title}</h3>

					<div className='grid gap-3 grid-cols-1'>
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
										nominationType={nominationType}
										voted={voted}
										setVoted={setVoted}
									/>
							  ))}
					</div>
				</div>
			)
		)
	}
)

export default NominationVotesSection
