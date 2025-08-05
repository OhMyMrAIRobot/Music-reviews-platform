import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../components/carousel/Last-reviews-carousel'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { CarouselRef } from '../../../types/carousel-ref'

const AuthorDetailsReviewsCarousel = () => {
	const { id } = useParams()

	const { authorDetailsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchLastReviews
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [fetch, id])

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Последние рецензии'}
			buttonTitle={''}
			showButton={false}
			href={'#'}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isLoading}
					items={authorDetailsPageStore.lastReviews}
					rowCount={1}
					storeToggle={authorDetailsPageStore.toggleFavReview}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default AuthorDetailsReviewsCarousel
