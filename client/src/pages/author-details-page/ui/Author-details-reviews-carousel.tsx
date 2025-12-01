import { useQuery } from '@tanstack/react-query'
import { FC, useRef, useState } from 'react'
import { ReviewAPI } from '../../../api/review/review-api'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../components/carousel/Last-reviews-carousel'
import { reviewsKeys } from '../../../query-keys/reviews-keys'
import { SortOrdersEnum } from '../../../types/common'
import { CarouselRef } from '../../../types/common/types/carousel-ref'
import { ReviewsQuery, ReviewsSortFieldsEnum } from '../../../types/review'

interface IProps {
	id: string
}

const limit = 25

const AuthorDetailsReviewsCarousel: FC<IProps> = ({ id }) => {
	const query: ReviewsQuery = {
		authorId: id,
		limit,
		offset: 0,
		sortOrder: SortOrdersEnum.DESC,
		sortField: ReviewsSortFieldsEnum.CREATED,
	}

	const { data, isPending } = useQuery({
		queryKey: reviewsKeys.list(query),
		queryFn: () => ReviewAPI.findAll(query),
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
