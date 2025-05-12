import { useEffect, useRef } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
import LastReleasesCarousel, {
	CarouselRef,
} from '../carousel/lastReleases/LastReleasesCarousel'
import MainCarouselSection from './MainCarouselSection'

const LastReleasesContainer = () => {
	const { navigateToReleases } = useCustomNavigate()
	const carouselRef = useRef<CarouselRef>(null)

	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	const { releasesStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		releasesStore.fetchLastReleases
	)

	useEffect(() => {
		fetch()
	}, [])

	return (
		<MainCarouselSection
			title={'Добавленные релизы'}
			buttonTitle={'Все релизы'}
			onButtonClick={navigateToReleases}
			showButton={true}
			handlePrev={handlePrev}
			handleNext={handleNext}
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

export default LastReleasesContainer
