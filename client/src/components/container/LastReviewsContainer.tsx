import { useEffect, useRef } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
import { CarouselRef } from '../carousel/lastReleases/LastReleasesCarousel'
import LastReviewsCarousel from '../carousel/lastReviews/LastReviewsCarousel'
import MainCarouselSection from './MainCarouselSection'

const LastReviewsContainer = () => {
	const { reviewsStore } = useStore()
	const { navigateToReviews } = useCustomNavigate()

	const carouselRef = useRef<CarouselRef>(null)
	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	const { execute: fetch, isLoading } = useLoading(
		reviewsStore.fetchLastReviews
	)

	useEffect(() => {
		fetch()
	}, [])

	return (
		<MainCarouselSection
			title={'Новые рецензии'}
			buttonTitle={'Все рецензии'}
			showButton={true}
			onButtonClick={navigateToReviews}
			handlePrev={handlePrev}
			handleNext={handleNext}
			Carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isLoading}
					items={reviewsStore.lastReviews}
					rowCount={3}
				/>
			}
		/>
	)
}

export default LastReviewsContainer
