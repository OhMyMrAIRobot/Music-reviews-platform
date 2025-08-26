/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { NominationTypesEnum } from '../../models/nomination/nomination-type/nomination-type-enum'
import { MonthEnum, MonthEnumType } from '../../types/month-enum-type'
import NominationVotesSection from './ui/Nomination-votes-section'

const NominationVotesPage = observer(() => {
	const { nominationVotesPageStore, metaStore, authStore } = useStore()

	const { execute: fetchCandidates, isLoading: isCandidatesLoading } =
		useLoading(nominationVotesPageStore.fetchCandidates)

	const { execute: fetchTypes, isLoading: isTypesLoading } = useLoading(
		metaStore.fetchNominationTypes
	)

	const { execute: fetchVotes, isLoading: isVotesLoading } = useLoading(
		nominationVotesPageStore.fetchUserVotes
	)

	useEffect(() => {
		fetchCandidates()
		if (metaStore.nominationTypes.length === 0) {
			fetchTypes()
		}
	}, [])

	useEffect(() => {
		if (authStore.isAuth) {
			fetchVotes()
		}
	}, [authStore.isAuth])

	return (
		<>
			<h1 className='text-lg md:text-xl lg:text-3xl font-semibold'>
				Голосование за {MonthEnum[new Date().getUTCMonth() as MonthEnumType]}
			</h1>

			<div className='mt-10 grid lg:grid-cols-2 gap-5'>
				<NominationVotesSection
					isLoading={isCandidatesLoading || isTypesLoading || isVotesLoading}
					title={NominationTypesEnum.HIT_OF_MONTH}
					candidates={nominationVotesPageStore.candidates?.singleCandidates}
					nominationType={metaStore.nominationTypes.find(
						t => t.type === NominationTypesEnum.HIT_OF_MONTH
					)}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading || isTypesLoading || isVotesLoading}
					title={NominationTypesEnum.ALBUM_OF_MONTH}
					candidates={nominationVotesPageStore.candidates?.albumCandidates}
					nominationType={metaStore.nominationTypes.find(
						t => t.type === NominationTypesEnum.ALBUM_OF_MONTH
					)}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading || isTypesLoading || isVotesLoading}
					title={NominationTypesEnum.COVER_OF_MONTH}
					candidates={nominationVotesPageStore.candidates?.coverCandidates}
					nominationType={metaStore.nominationTypes.find(
						t => t.type === NominationTypesEnum.COVER_OF_MONTH
					)}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading || isTypesLoading || isVotesLoading}
					title={NominationTypesEnum.ARTIST_OF_MONTH}
					candidates={nominationVotesPageStore.candidates?.artistCandidates}
					nominationType={metaStore.nominationTypes.find(
						t => t.type === NominationTypesEnum.ARTIST_OF_MONTH
					)}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading || isTypesLoading || isVotesLoading}
					title={NominationTypesEnum.PRODUCER_OF_MONTH}
					candidates={nominationVotesPageStore.candidates?.producerCandidates}
					nominationType={metaStore.nominationTypes.find(
						t => t.type === NominationTypesEnum.PRODUCER_OF_MONTH
					)}
				/>
			</div>
		</>
	)
})

export default NominationVotesPage
