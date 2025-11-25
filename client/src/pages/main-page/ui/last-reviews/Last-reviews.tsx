import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ReviewAPI } from '../../../../api/review/review-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../../components/carousel/Last-reviews-carousel'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { reviewsKeys } from '../../../../query-keys/reviews-keys'
import { CarouselRef } from '../../../../types/carousel-ref'
import { ReviewsSortFieldsEnum } from '../../../../types/review'

const LIMIT = 45
const OFFSET = 0
const FIELD = ReviewsSortFieldsEnum.CREATED
const ORDER = SortOrdersEnum.DESC

const LastReviews = () => {
	const { navigateToReviews } = useNavigationPath()

	const queryKey = reviewsKeys.list({
		order: ORDER,
		limit: LIMIT,
		offset: OFFSET,
		authorId: null,
		releaseId: null,
	})

	const { data, isPending } = useQuery({
		queryKey,
		queryFn: () =>
			ReviewAPI.findAll({
				sortField: FIELD,
				sortOrder: ORDER,
				limit: LIMIT,
				offset: OFFSET,
			}),
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.items ?? []

	// const { storeToggle } = useQueryListFavToggleAll<
	// 	IReview,
	// 	{ reviews: IReview[] }
	// >(reviewsKeys.all, 'reviews', toggleFavReview)

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Новые рецензии'}
			buttonTitle={'Все рецензии'}
			showButton={true}
			href={navigateToReviews}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<LastReviewsCarousel
					ref={carouselRef}
					isLoading={isPending}
					items={items}
					rowCount={3}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
					storeToggle={function (
						// TODO: fix toggle
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						reviewId: string,
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						isFav: boolean
					): Promise<string[]> {
						throw new Error('Function not implemented.')
					}}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default LastReviews
