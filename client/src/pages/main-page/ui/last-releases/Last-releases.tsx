import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ReleaseAPI } from '../../../../api/release/release-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { releasesKeys } from '../../../../query-keys/releases-keys'
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum'
import { CarouselRef } from '../../../../types/common/types/carousel-ref'
import { ReleasesSortFieldsEnum } from '../../../../types/release'
import LastReleasesCarousel from './carousel/Last-releases-carousel'

const LIMIT = 20
const OFFSET = 0
const FIELD = ReleasesSortFieldsEnum.PUBLISHED
const ORDER = SortOrdersEnum.DESC

const queryKey = releasesKeys.list({
	typeId: null,
	sortField: FIELD,
	sortOrder: ORDER,
	limit: LIMIT,
	offset: OFFSET,
})

const queryFn = () =>
	ReleaseAPI.findAll({
		limit: LIMIT,
		offset: OFFSET,
		sortField: FIELD,
		sortOrder: ORDER,
	})

const LastReleases = () => {
	const { navigateToReleases } = useNavigationPath()

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.items ?? []

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
