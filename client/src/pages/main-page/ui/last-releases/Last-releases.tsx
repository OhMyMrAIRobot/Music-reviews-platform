import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ReleaseAPI } from '../../../../api/release/release-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { ReleaseSortFieldValuesEnum } from '../../../../models/release/release-sort/release-sort-field-values'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { CarouselRef } from '../../../../types/carousel-ref'
import LastReleasesCarousel from './carousel/Last-releases-carousel'

const LIMIT = 20
const OFFSET = 0
const FIELD = ReleaseSortFieldValuesEnum.PUBLISHED
const ORDER = SortOrdersEnum.DESC

const queryKey = [
	'releases',
	{
		field: FIELD,
		order: ORDER,
		limit: LIMIT,
		offset: OFFSET,
	},
] as const

const queryFn = () =>
	ReleaseAPI.fetchReleases(null, null, FIELD, ORDER, LIMIT, OFFSET)

const LastReleases = () => {
	const { navigateToReleases } = useNavigationPath()

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.releases ?? []

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Добавленные релизы'}
			buttonTitle={'Все релизы'}
			href={navigateToReleases}
			showButton={true}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<LastReleasesCarousel
					items={items}
					isLoading={isPending}
					ref={carouselRef}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default LastReleases
