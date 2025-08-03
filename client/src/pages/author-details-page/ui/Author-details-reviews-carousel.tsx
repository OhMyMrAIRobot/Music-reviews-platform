import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../components/carousel/Last-reviews-carousel'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { CarouselRef } from '../../../types/carousel-ref'

const AuthorDetailsReviewsCarousel = () => {
	const { id } = useParams()

	const { authorDetailsPageStore } = useStore()

	const carouselRef = useRef<CarouselRef>(null)
	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchLastReviews
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [fetch, id])

	return (
		<CarouselContainer
			title={'Последние рецензии'}
			buttonTitle={''}
			showButton={false}
			href={'#'}
			handlePrev={handlePrev}
			handleNext={handleNext}
			Carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isLoading}
					items={authorDetailsPageStore.lastReviews}
					rowCount={1}
					storeToggle={authorDetailsPageStore.toggleFavReview}
				/>
			}
		/>
	)
}

export default AuthorDetailsReviewsCarousel
