/* eslint-disable react-hooks/exhaustive-deps */
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { MonthEnum, MonthEnumType } from '../../types/month-enum-type'
import NominationVotesSection from './ui/Nomination-votes-section'

const NominationVotesPage = observer(() => {
	const { nominationVotesPageStore } = useStore()

	const { execute: fetchCandidates, isLoading: isCandidatesLoading } =
		useLoading(nominationVotesPageStore.fetchCandidates)

	useEffect(() => {
		fetchCandidates()
	}, [])

	return (
		<>
			<h1 className='text-lg md:text-xl lg:text-3xl font-semibold'>
				Голосование за {MonthEnum[new Date().getMonth() as MonthEnumType]}
			</h1>

			<div className='mt-10 grid lg:grid-cols-2 gap-5'>
				<NominationVotesSection
					isLoading={isCandidatesLoading}
					title={'Хит месяца'}
					candidates={nominationVotesPageStore.candidates?.singleCandidates}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading}
					title={'Альбом месяца'}
					candidates={nominationVotesPageStore.candidates?.albumCandidates}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading}
					title={'Обложка месяца'}
					candidates={nominationVotesPageStore.candidates?.coverCandidates}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading}
					title={'Артист месяца'}
					candidates={nominationVotesPageStore.candidates?.artistCandidates}
				/>

				<NominationVotesSection
					isLoading={isCandidatesLoading}
					title={'Продюсер месяца'}
					candidates={nominationVotesPageStore.candidates?.producerCandidates}
				/>
			</div>
		</>
	)
})

export default NominationVotesPage
