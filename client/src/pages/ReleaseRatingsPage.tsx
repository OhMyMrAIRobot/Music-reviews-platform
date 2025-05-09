import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import ReleaseRatingsHeader from '../components/releaseRatingsPage/releaseRatingsHeader'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const ReleaseRatingsPage = () => {
	const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
	const [year, setYear] = useState<number | null>(new Date().getFullYear())

	const { releaseRatingsPageStore } = useStore()
	const { execute: fetch, isLoading } = useLoading(
		releaseRatingsPageStore.fetchReleases
	)

	useEffect(() => {
		fetch(year, month)
	}, [year, month])

	return isLoading ? (
		<Loader />
	) : (
		<>
			<ReleaseRatingsHeader
				selectedMonth={month}
				setSelectedMonth={setMonth}
				selectedYear={year}
				setSelectedYear={setYear}
				minYear={releaseRatingsPageStore.minYear ?? 0}
				maxYear={new Date().getFullYear()}
			/>
		</>
	)
}

export default ReleaseRatingsPage
