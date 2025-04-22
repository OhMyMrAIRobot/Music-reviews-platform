import { useRef } from 'react'
import LastReleasesCarousel, {
	CarouselRef,
} from '../carousel/lastReleases/LastReleasesCarousel'
import MainCarouselSection from './MainCarouselSection'

const LastReleasesContainer = () => {
	const carouselRef = useRef<CarouselRef>(null)

	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	return (
		<MainCarouselSection
			title={'Добавленные релизы'}
			buttonTitle={'Все релизы'}
			onButtonClick={() => {}}
			handlePrev={handlePrev}
			handleNext={handleNext}
			Carousel={<LastReleasesCarousel ref={carouselRef} />}
		/>
	)
}

export default LastReleasesContainer
