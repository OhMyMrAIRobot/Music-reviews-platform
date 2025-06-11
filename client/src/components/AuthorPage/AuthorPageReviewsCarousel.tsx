import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { CarouselRef } from '../../types/carousel-ref'
import CarouselContainer from '../carousel/Carousel-container'
import LastReviewsCarousel from '../carousel/Last-reviews-carousel'

const AuthorPageReviewsCarousel = () => {
	const { id } = useParams()
	const { authorPageStore } = useStore()
	const { navigateToReviews } = useCustomNavigate()

	const carouselRef = useRef<CarouselRef>(null)
	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	const { execute: fetch, isLoading } = useLoading(
		authorPageStore.fetchLastReviews
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [])

	return (
		<CarouselContainer
			title={'Последние рецензии'}
			buttonTitle={''}
			showButton={false}
			onButtonClick={navigateToReviews}
			handlePrev={handlePrev}
			handleNext={handleNext}
			Carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isLoading}
					items={authorPageStore.lastReviews}
					rowCount={1}
				/>
			}
		/>
	)
}

export default AuthorPageReviewsCarousel
