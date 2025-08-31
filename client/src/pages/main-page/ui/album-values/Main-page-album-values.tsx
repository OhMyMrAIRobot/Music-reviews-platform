import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import MainPageAlbumValuesCarousel from './Main-page-album-values-carousel'

const MainPageAlbumValues = observer(() => {
	const { mainPageStore } = useStore()

	const { navigateToAlbumValues } = useNavigationPath()

	const { execute: fetch, isLoading } = useLoading(
		mainPageStore.fetchAlbumValues
	)

	useEffect(() => {
		fetch()
	}, [fetch])

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
					items={mainPageStore.albumValues}
					isLoading={isLoading}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
})

export default MainPageAlbumValues
