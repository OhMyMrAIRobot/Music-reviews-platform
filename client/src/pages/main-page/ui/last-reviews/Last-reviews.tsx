import { useEffect, useRef } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../../components/carousel/Last-reviews-carousel'
import useCustomNavigate from '../../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../../hooks/UseLoading'
import { useStore } from '../../../../hooks/UseStore'
import { CarouselRef } from '../../../../types/carousel-ref'

const LastReviews = () => {
	const carouselRef = useRef<CarouselRef>(null)

	const { reviewsStore } = useStore()

	const { navigateToReviews } = useCustomNavigate()

	const { execute: fetch, isLoading } = useLoading(
		reviewsStore.fetchLastReviews
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	return (
		<CarouselContainer
			title={'Новые рецензии'}
			buttonTitle={'Все рецензии'}
			showButton={true}
			onButtonClick={navigateToReviews}
			handlePrev={() => {
				carouselRef.current?.scrollPrev()
			}}
			handleNext={() => {
				carouselRef.current?.scrollNext()
			}}
			Carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isLoading}
					items={reviewsStore.lastReviews}
					rowCount={3}
					storeToggle={reviewsStore.toggleFavReview}
				/>
			}
		/>
	)
}

export default LastReviews
