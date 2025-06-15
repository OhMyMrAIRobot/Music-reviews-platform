import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorsPageReleasesCol from '../components/authorPage/AuthorPageAllReleases/AuthorsPageReleasesCol'
import Loader from '../components/loader/loader'
import ReleasesRatingsHeader from '../components/releasesRatingsPage/ReleasesRatingsHeader'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'
import { ReleaseTypesEnum } from '../models/release/release-types'

const ReleasesRatingsPage = observer(() => {
	const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
	const [year, setYear] = useState<number | null>(new Date().getFullYear())

	const { releaseRatingsPageStore } = useStore()
	const { execute: fetch, isLoading } = useLoading(
		releaseRatingsPageStore.fetchReleases
	)

	useEffect(() => {
		fetch(year, month)
	}, [year, month])

	const tracks = releaseRatingsPageStore.releases.filter(
		val => val.release_type === ReleaseTypesEnum.SINGLE
	)

	const albums = releaseRatingsPageStore.releases.filter(
		val => val.release_type === ReleaseTypesEnum.ALBUM
	)

	return (
		<>
			<ReleasesRatingsHeader
				selectedMonth={month}
				setSelectedMonth={setMonth}
				selectedYear={year}
				setSelectedYear={setYear}
				minYear={
					releaseRatingsPageStore.minYear ?? new Date().getFullYear() - 5
				}
				maxYear={new Date().getFullYear()}
			/>
			{isLoading ? (
				<Loader />
			) : (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5'>
					<AuthorsPageReleasesCol title={'Треки'} releases={tracks} />
					<AuthorsPageReleasesCol title={'Альбомы'} releases={albums} />
				</div>
			)}
		</>
	)
})

export default ReleasesRatingsPage
