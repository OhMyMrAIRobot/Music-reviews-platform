import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ReleaseAPI } from '../../../../api/release/release-api'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { releasesKeys } from '../../../../query-keys/releases-keys'
import { ReleasesSortFieldsEnum } from '../../../../types/release'
import MostReviewedCarousel from './carousel/Most-reviewed-carousel'
import MostReviewedSwiper from './swiper/Most-reviewed-swiper'

const LIMIT = 15
const OFFSET = 0

const queryKey = releasesKeys.mostReviewed()
const queryFn = () =>
	ReleaseAPI.fetchAll({
		sortField: ReleasesSortFieldsEnum.TOTAL_COUNT,
		sortOrder: SortOrdersEnum.DESC,
		last24h: true,
		limit: LIMIT,
		offset: OFFSET,
	})

const MostReviewedReleases = () => {
	const [index, setIndex] = useState<number>(0)
	const [show, setShow] = useState<boolean>(false)

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const mostReviewedReleases = data?.items || []

	return (
		<section className='2xl:container flex flex-col items-center'>
			<div className='flex justify-center items-center mb-2.5 lg:mb-5'>
				<h3 className='text-xs lg:text-sm font-semibold text-center bg-gradient-to-br from-zinc-700 border border-zinc-800 rounded-full px-5 py-1.5 select-none'>
					ТОП-15 по количеству оценок и рецензий за сутки
				</h3>
			</div>
			<MostReviewedSwiper
				show={show}
				setShow={setShow}
				index={index}
				setIndex={setIndex}
				items={mostReviewedReleases}
			/>
			<MostReviewedCarousel
				setShow={setShow}
				setIndex={setIndex}
				items={mostReviewedReleases}
				isLoading={isPending}
			/>
		</section>
	)
}

export default MostReviewedReleases
