import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { forwardRef, useImperativeHandle } from 'react'
import { IReview } from '../../models/review/Review'
import { CarouselRef } from '../../types/carousel-ref'
import { TogglePromiseResult } from '../../types/toggle-promise-result'
import ReviewCard from '../review/review-card/Review-card'

interface IProps {
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
		({ items, rowCount, isLoading, storeToggle }, ref) => {
			const options: EmblaOptionsType = {
				align: 'start',
				slidesToScroll: 'auto',
			}
			const [emblaRef, emblaApi] = useEmblaCarousel(options)

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
									className='flex-[0_0_100%] md:flex-[0_0_33%] px-1'
									key={idx}
								>
									<div className={`grid grid-rows-${rowCount} gap-4`}>
										{isLoading
											? // SCELETON
											  Array.from({ length: rowCount }).map((_, i) => (
													<div
														key={`last-review-skeleton-${idx}-${i}`}
														className='bg-gray-400 rounded-lg animate-pulse opacity-40 h-64'
													/>
											  ))
											: // ITEM VIEW
											  items
													.slice(idx * rowCount, idx * rowCount + rowCount)
													.map(review => (
														<ReviewCard
															review={review}
															key={review.id}
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
