import { useEffect, useRef } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import LastReleasesCarousel from './carousel/Last-releases-carousel'

const LastReleases = () => {
	const { navigateToReleases } = useCustomNavigate()

	const carouselRef = useRef<CarouselRef>(null)

	const { releasesStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		releasesStore.fetchLastReleases
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	return (
		<CarouselContainer
			title={'Добавленные релизы'}
			buttonTitle={'Все релизы'}
			onButtonClick={navigateToReleases}
			showButton={true}
			handlePrev={() => {
				carouselRef.current?.scrollPrev()
			}}
			handleNext={() => {
				carouselRef.current?.scrollNext()
			}}
			Carousel={
				<LastReleasesCarousel
					items={releasesStore.lastReleases}
					isLoading={isLoading}
					ref={carouselRef}
				/>
			}
		/>
	)
}

export default LastReleases
