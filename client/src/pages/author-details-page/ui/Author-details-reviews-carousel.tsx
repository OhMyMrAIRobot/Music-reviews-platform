import { useQuery } from '@tanstack/react-query'
import { FC, useRef, useState } from 'react'
import { ReviewAPI } from '../../../api/review/review-api'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../components/carousel/Last-reviews-carousel'
import { useQueryListFavToggleAll } from '../../../hooks/use-query-list-fav-toggle'
import { IReview } from '../../../models/review/review'
import { reviewsKeys } from '../../../query-keys/reviews-keys'
import { CarouselRef } from '../../../types/carousel-ref'
import { toggleFavReview } from '../../../utils/toggle-fav-review'

interface IProps {
	id: string
}

const COUNT = 25

const AuthorDetailsReviewsCarousel: FC<IProps> = ({ id }) => {
	const { data: lastReviews, isPending } = useQuery({
		queryKey: reviewsKeys.byAuthor(id, COUNT, 0),
		queryFn: () => ReviewAPI.fetchReviewsByAuthorId(id, COUNT, 0),
		staleTime: 1000 * 60 * 5,
	})

	const { storeToggle } = useQueryListFavToggleAll<IReview, IReview[]>(
		reviewsKeys.all,
		null,
		toggleFavReview
	)

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		(isPending || (lastReviews && lastReviews.length > 0)) && (
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
						isLoading={isPending}
						items={lastReviews || []}
						rowCount={1}
						storeToggle={storeToggle}
						onCanScrollPrevChange={setCanScrollPrev}
						onCanScrollNextChange={setCanScrollNext}
					/>
				}
				canScrollNext={canScrollNext}
				canScrollPrev={canScrollPrev}
			/>
		)
	)
}

export default AuthorDetailsReviewsCarousel
