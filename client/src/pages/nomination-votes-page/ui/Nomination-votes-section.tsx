import { FC, useEffect, useState } from 'react'
import { NominationCandidate } from '../../../models/nomination/nomination-candidate/nomination-candidate'
import { NominationEntityKind } from '../../../models/nomination/nomination-entity-kind'
import { INominationType } from '../../../models/nomination/nomination-type/nomination-type'
import { INominationUserVote } from '../../../models/nomination/nomination-user-vote'
import NominationVotesSectionItem from './Nomination-votes-section-item'

interface IProps {
	title: string
	isLoading: boolean
	candidates?: NominationCandidate[]
	nominationType?: INominationType
	userVotes: INominationUserVote[]
	postVote: (
		nominationTypeId: string,
		entityKind: NominationEntityKind,
		entityId: string
	) => Promise<string[]>
}

const NominationVotesSection: FC<IProps> = ({
	title,
	candidates,
	isLoading,
	nominationType,
	userVotes,
	postVote,
}) => {
	const [voted, setVoted] = useState<boolean>(false)

	useEffect(() => {
		if (!nominationType) {
			setVoted(false)
			return
		}
		const hasVoteForThisType = userVotes.some(
			v => v.nominationType.type === nominationType.type
		)
		setVoted(hasVoteForThisType)
	}, [nominationType, userVotes])

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
									userVotes={userVotes}
									postVote={postVote}
								/>
						  ))}
				</div>
			</div>
		)
	)
}

export default NominationVotesSection
