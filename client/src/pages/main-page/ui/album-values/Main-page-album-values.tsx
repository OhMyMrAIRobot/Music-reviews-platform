import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { AlbumValueAPI } from '../../../../api/album-value-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { albumValuesKeys } from '../../../../query-keys/album-values-keys'
import { CarouselRef } from '../../../../types/carousel-ref'
import MainPageAlbumValuesCarousel from './Main-page-album-values-carousel'

const LIMIT = 15
const OFFSET = 0

const queryKey = albumValuesKeys.list({
	limit: LIMIT,
	offset: OFFSET,
	order: null,
	tiers: null,
	authorId: null,
	releaseId: null,
})

const queryFn = () => AlbumValueAPI.fetchAlbumValues(LIMIT, OFFSET, null, null)

const MainPageAlbumValues = () => {
	const { navigateToAlbumValues } = useNavigationPath()

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.values ?? []

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Ценность альбомов'}
			buttonTitle={'Каталог ценности альбомов'}
			showButton={true}
			href={navigateToAlbumValues}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<MainPageAlbumValuesCarousel
					ref={carouselRef}
					items={items}
					isLoading={isPending}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default MainPageAlbumValues
