import { useQuery } from '@tanstack/react-query'
import { FC, useRef, useState } from 'react'
import { ReviewAPI } from '../../../api/review/review-api'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../components/carousel/Last-reviews-carousel'
import { reviewsKeys } from '../../../query-keys/reviews-keys'
import { CarouselRef } from '../../../types/carousel-ref'

interface IProps {
	id: string
}

const COUNT = 25

const AuthorDetailsReviewsCarousel: FC<IProps> = ({ id }) => {
	const { data, isPending } = useQuery({
		queryKey: reviewsKeys.byAuthor(id, COUNT, 0),
		queryFn: () => ReviewAPI.findAll({ authorId: id, limit: COUNT, offset: 0 }),
		staleTime: 1000 * 60 * 5,
	})

	const lastReviews = data?.items

	// const { storeToggle } = useQueryListFavToggleAll<IReview, IReview[]>(
	// 	reviewsKeys.all,
	// 	null,
	// 	toggleFavReview
	// )

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
						onCanScrollPrevChange={setCanScrollPrev}
						onCanScrollNextChange={setCanScrollNext}
						storeToggle={function (
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							reviewId: string,
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							isFav: boolean
						): Promise<string[]> {
							throw new Error('Function not implemented.')
						}} // TODO: Fix toggle
					/>
				}
				canScrollNext={canScrollNext}
				canScrollPrev={canScrollPrev}
			/>
		)
	)
}

export default AuthorDetailsReviewsCarousel
