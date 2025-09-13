import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ReleaseAPI } from '../../api/release/release-api'
import ReleasesColumn from '../../components/release/releases-column/Releases-column'
import { IRelease } from '../../models/release/release'
import { ReleaseTypesEnum } from '../../models/release/release-type/release-types-enum'
import ReleasesRatingPageHeader from './ui/Releases-rating-page-header'

type TopRatingResponse = {
	releases: IRelease[]
	minYear: number
	maxYear: number
}

const ReleasesRatingPage = () => {
	const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
	const [year, setYear] = useState<number | null>(new Date().getFullYear())

	const { data, isPending } = useQuery<TopRatingResponse>({
		queryKey: ['topRatingReleases', { year, month }],
		queryFn: () => ReleaseAPI.fetchTopRatingReleases(year, month),
		enabled: true,
		staleTime: 1000 * 60 * 5,
	})

	const releases = data?.releases ?? []

	const tracks = releases.filter(
		val => val.releaseType === ReleaseTypesEnum.SINGLE
	)
	const albums = releases.filter(
		val => val.releaseType === ReleaseTypesEnum.ALBUM
	)

	return (
		<>
			<ReleasesRatingPageHeader
				selectedMonth={month}
				setSelectedMonth={setMonth}
				selectedYear={year}
				setSelectedYear={setYear}
				minYear={data?.minYear ?? null}
				maxYear={data?.maxYear ?? new Date().getFullYear()}
				isLoading={isPending}
			/>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 space-y-5'>
				<ReleasesColumn
					title={'Треки'}
					releases={tracks}
					isLoading={isPending}
				/>
				<ReleasesColumn
					title={'Альбомы'}
					releases={albums}
					isLoading={isPending}
				/>
			</div>
		</>
	)
}

export default ReleasesRatingPage
