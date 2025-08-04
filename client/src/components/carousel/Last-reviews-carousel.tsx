import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react'
import { IReview } from '../../models/review/review.ts'
import { CarouselRef } from '../../types/carousel-ref'
import { CarouselStateCallbacks } from '../../types/carousel-state-callbacks.ts'
import { TogglePromiseResult } from '../../types/toggle-promise-result'
import ReviewCard from '../review/review-card/Review-card'

interface IProps extends CarouselStateCallbacks {
	items: IReview[]
	rowCount: number
	isLoading: boolean
	storeToggle: (
		reviewId: string,
		isLiked: boolean
	) => Promise<TogglePromiseResult>
}

const LastReviewsCarousel = observer(
	forwardRef<CarouselRef, IProps>(
		(
			{
				items,
				rowCount,
				isLoading,
				storeToggle,
				onCanScrollPrevChange,
				onCanScrollNextChange,
			},
			ref
		) => {
			const options: EmblaOptionsType = {
				align: 'start',
				slidesToScroll: 'auto',
			}
			const [emblaRef, emblaApi] = useEmblaCarousel(options)
			const [, setCanScrollPrev] = useState(false)
			const [, setCanScrollNext] = useState(false)

			const updateScrollState = useCallback(() => {
				if (!emblaApi) return

				const newCanScrollPrev = emblaApi.canScrollPrev()
				const newCanScrollNext = emblaApi.canScrollNext()

				setCanScrollPrev(newCanScrollPrev)
				setCanScrollNext(newCanScrollNext)

				onCanScrollPrevChange(newCanScrollPrev)
				onCanScrollNextChange(newCanScrollNext)
			}, [emblaApi, onCanScrollPrevChange, onCanScrollNextChange])

			useEffect(() => {
				if (!emblaApi) return

				updateScrollState()

				emblaApi.on('select', updateScrollState)
				emblaApi.on('reInit', updateScrollState)
				emblaApi.on('resize', updateScrollState)

				return () => {
					emblaApi.off('select', updateScrollState)
					emblaApi.off('reInit', updateScrollState)
					emblaApi.off('resize', updateScrollState)
				}
			}, [emblaApi, updateScrollState])

			useImperativeHandle(
				ref,
				() => ({
					scrollPrev: () => emblaApi?.scrollPrev(),
					scrollNext: () => emblaApi?.scrollNext(),
				}),
				[emblaApi]
			)

			return (
				<div className='embla w-full select-none'>
					<div ref={emblaRef} className='embla__viewport pt-2'>
						<div className='embla__container gap-1 touch-pan-y touch-pinch-zoom'>
							{Array.from({
								length: Math.ceil(
									isLoading ? 15 / rowCount : items.length / rowCount
								),
							}).map((_, idx) => (
								<div
									className='flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33%] px-1'
									key={idx}
								>
									<div className={`grid grid-rows-${rowCount} gap-4`}>
										{isLoading
											? // SCELETON
											  Array.from({ length: rowCount }).map((_, i) => (
													<ReviewCard
														key={`last-review-skeleton-${idx}-${i}`}
														isLoading={isLoading}
													/>
											  ))
											: // ITEM VIEW
											  items
													.slice(idx * rowCount, idx * rowCount + rowCount)
													.map(review => (
														<ReviewCard
															review={review}
															key={review.id}
															isLoading={isLoading}
															storeToggle={storeToggle}
														/>
													))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)
		}
	)
)

export default LastReviewsCarousel
