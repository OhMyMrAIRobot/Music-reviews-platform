import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ReleaseAPI } from '../../../../api/release/release-api'
import { releasesKeys } from '../../../../query-keys/releases-keys'
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum'
import {
	ReleasesQuery,
	ReleasesSortFieldsEnum,
} from '../../../../types/release'
import MostReviewedCarousel from './carousel/Most-reviewed-carousel'
import MostReviewedSwiper from './swiper/Most-reviewed-swiper'

const query: ReleasesQuery = {
	sortField: ReleasesSortFieldsEnum.TOTAL_COUNT,
	sortOrder: SortOrdersEnum.DESC,
	last24h: true,
	limit: 15,
	offset: 0,
}

const MostReviewedReleases = () => {
	const [index, setIndex] = useState<number>(0)
	const [show, setShow] = useState<boolean>(false)

	const { data, isPending } = useQuery({
		queryKey: releasesKeys.list(query),
		queryFn: () => ReleaseAPI.findAll(query),
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
