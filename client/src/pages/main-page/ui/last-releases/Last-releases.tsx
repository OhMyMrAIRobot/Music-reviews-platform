import { useEffect, useRef } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import LastReleasesCarousel from './carousel/Last-releases-carousel'

const LastReleases = () => {
	const { navigateToReleases } = useNavigationPath()

	const carouselRef = useRef<CarouselRef>(null)

	const { mainPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		mainPageStore.fetchLastReleases
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	return (
		<CarouselContainer
			title={'Добавленные релизы'}
			buttonTitle={'Все релизы'}
			href={navigateToReleases}
			showButton={true}
			handlePrev={() => {
				carouselRef.current?.scrollPrev()
			}}
			handleNext={() => {
				carouselRef.current?.scrollNext()
			}}
			carousel={
				<LastReleasesCarousel
					items={mainPageStore.lastReleases}
					isLoading={isLoading}
					ref={carouselRef}
				/>
			}
		/>
	)
}

export default LastReleases
