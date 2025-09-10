import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import ReleasesColumn from '../../components/release/releases-column/Releases-column'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { ReleaseTypesEnum } from '../../models/release/release-type/release-types-enum'
import ReleasesRatingPageHeader from './ui/Releases-rating-page-header'

const ReleasesRatingPage = observer(() => {
	const { releasesRatingPageStore } = useStore()

	const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
	const [year, setYear] = useState<number | null>(new Date().getFullYear())

	const { execute: fetch, isLoading } = useLoading(
		releasesRatingPageStore.fetchReleases
	)

	useEffect(() => {
		fetch(year, month)
	}, [year, month, fetch])

	const tracks = releasesRatingPageStore.releases.filter(
		val => val.releaseType === ReleaseTypesEnum.SINGLE
	)

	const albums = releasesRatingPageStore.releases.filter(
		val => val.releaseType === ReleaseTypesEnum.ALBUM
	)

	return (
		<>
			<ReleasesRatingPageHeader
				selectedMonth={month}
				setSelectedMonth={setMonth}
				selectedYear={year}
				setSelectedYear={setYear}
				minYear={releasesRatingPageStore.minYear}
				maxYear={new Date().getFullYear()}
				isLoading={isLoading}
			/>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 space-y-5'>
				<ReleasesColumn
					title={'Треки'}
					releases={tracks}
					isLoading={isLoading}
				/>
				<ReleasesColumn
					title={'Альбомы'}
					releases={albums}
					isLoading={isLoading}
				/>
			</div>
		</>
	)
})

export default ReleasesRatingPage
