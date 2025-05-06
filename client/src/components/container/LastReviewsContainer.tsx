import { useRef } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { CarouselRef } from '../carousel/lastReleases/LastReleasesCarousel'
import LastReviewsCarousel from '../carousel/lastReviews/LastReviewsCarousel'
import MainCarouselSection from './MainCarouselSection'

const LastReviewsContainer = () => {
	const { navigateToReviews } = useCustomNavigate()

	const carouselRef = useRef<CarouselRef>(null)
	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	return (
		<MainCarouselSection
			title={'Новые рецензии'}
			buttonTitle={'Все рецензии'}
			showButton={true}
			onButtonClick={navigateToReviews}
			handlePrev={handlePrev}
			handleNext={handleNext}
			Carousel={<LastReviewsCarousel ref={carouselRef} />}
		/>
	)
}

export default LastReviewsContainer
