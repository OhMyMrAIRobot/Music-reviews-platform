import { useMemo } from 'react'
import { useNominationVotes } from '../../hooks/use-nomination-votes'
import { useStore } from '../../hooks/use-store'
import { NominationTypesEnum } from '../../models/nomination/nomination-type/nomination-type-enum'
import { MonthEnum, MonthEnumType } from '../../types/month-enum-type'
import NominationVotesSection from './ui/Nomination-votes-section'

const NominationVotesPage = () => {
	const { authStore } = useStore()

	const { nominationTypes, candidates, userVotes, postVote, isLoading } =
		useNominationVotes(authStore.isAuth)

	const hitType = useMemo(
		() =>
			nominationTypes.find(t => t.type === NominationTypesEnum.HIT_OF_MONTH),
		[nominationTypes]
	)
	const albumType = useMemo(
		() =>
			nominationTypes.find(t => t.type === NominationTypesEnum.ALBUM_OF_MONTH),
		[nominationTypes]
	)
	const coverType = useMemo(
		() =>
			nominationTypes.find(t => t.type === NominationTypesEnum.COVER_OF_MONTH),
		[nominationTypes]
	)
	const artistType = useMemo(
		() =>
			nominationTypes.find(t => t.type === NominationTypesEnum.ARTIST_OF_MONTH),
		[nominationTypes]
	)
	const producerType = useMemo(
		() =>
			nominationTypes.find(
				t => t.type === NominationTypesEnum.PRODUCER_OF_MONTH
			),
		[nominationTypes]
	)

	return (
		<>
			<h1 className='text-lg md:text-xl lg:text-3xl font-semibold'>
				Голосование за {MonthEnum[new Date().getUTCMonth() as MonthEnumType]}
			</h1>

			<div className='mt-10 grid lg:grid-cols-2 gap-5'>
				<NominationVotesSection
					isLoading={isLoading}
					title={NominationTypesEnum.HIT_OF_MONTH}
					candidates={candidates?.singleCandidates}
					nominationType={hitType}
					postVote={postVote}
					userVotes={userVotes}
				/>

				<NominationVotesSection
					isLoading={isLoading}
					title={NominationTypesEnum.ALBUM_OF_MONTH}
					candidates={candidates?.albumCandidates}
					nominationType={albumType}
					postVote={postVote}
					userVotes={userVotes}
				/>

				<NominationVotesSection
					isLoading={isLoading}
					title={NominationTypesEnum.COVER_OF_MONTH}
					candidates={candidates?.coverCandidates}
					nominationType={coverType}
					postVote={postVote}
					userVotes={userVotes}
				/>

				<NominationVotesSection
					isLoading={isLoading}
					title={NominationTypesEnum.ARTIST_OF_MONTH}
					candidates={candidates?.artistCandidates}
					nominationType={artistType}
					postVote={postVote}
					userVotes={userVotes}
				/>

				<NominationVotesSection
					isLoading={isLoading}
					title={NominationTypesEnum.PRODUCER_OF_MONTH}
					candidates={candidates?.producerCandidates}
					nominationType={producerType}
					postVote={postVote}
					userVotes={userVotes}
				/>
			</div>
		</>
	)
}

export default NominationVotesPage
