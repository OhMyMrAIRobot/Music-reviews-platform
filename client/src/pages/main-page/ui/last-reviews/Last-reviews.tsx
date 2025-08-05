import { useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../../components/carousel/Last-reviews-carousel'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'

const LastReviews = () => {
	const { mainPageStore } = useStore()

	const { navigateToReviews } = useNavigationPath()

	const { execute: fetch, isLoading } = useLoading(
		mainPageStore.fetchLastReviews
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Новые рецензии'}
			buttonTitle={'Все рецензии'}
			showButton={true}
			href={navigateToReviews}
			handlePrev={() => {
				carouselRef.current?.scrollPrev()
			}}
			handleNext={() => {
				carouselRef.current?.scrollNext()
			}}
			carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isLoading}
					items={mainPageStore.lastReviews}
					rowCount={3}
					storeToggle={mainPageStore.toggleFavReview}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default LastReviews
