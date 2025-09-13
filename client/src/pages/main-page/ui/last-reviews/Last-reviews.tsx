import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ReviewAPI } from '../../../../api/review/review-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import LastReviewsCarousel from '../../../../components/carousel/Last-reviews-carousel'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { IReview } from '../../../../models/review/review'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { CarouselRef } from '../../../../types/carousel-ref'
import { toggleFavReview } from '../../../../utils/toggle-fav-review'

const LIMIT = 45
const OFFSET = 0
const ORDER = SortOrdersEnum.DESC

const queryKey = [
	'reviews',
	{
		order: ORDER,
		limit: LIMIT,
		offset: OFFSET,
		authorId: null,
		releaseId: null,
	},
] as const

const queryFn = () => ReviewAPI.fetchReviews(ORDER, LIMIT, OFFSET, null, null)

const LastReviews = () => {
	const { navigateToReviews } = useNavigationPath()
	const queryClient = useQueryClient()

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.reviews ?? []

	const storeToggle = async (
		reviewId: string,
		isFav: boolean
	): Promise<string[]> => {
		const current = queryClient.getQueryData<{ reviews: IReview[] }>(queryKey)
		const currentList = current?.reviews ?? []
		const cloned = currentList.map(r => ({ ...r }))
		const updatedFavIds = await toggleFavReview(cloned, reviewId, isFav)
		queryClient.setQueryData<{ reviews: IReview[] }>(queryKey, {
			reviews: cloned,
		})

		return updatedFavIds
	}

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
					isLoading={isPending}
					items={items}
					rowCount={3}
					storeToggle={storeToggle}
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
