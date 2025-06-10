import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { forwardRef, useImperativeHandle } from 'react'
import { IReview } from '../../../models/review/Review'
import { CarouselRef } from '../../../types/carousel-ref'
import Loader from '../../Loader'
import ReviewItem from './ReviewItem'

interface IProps {
	items: IReview[]
	rowCount: number
	isLoading: boolean
}

const LastReviewsCarousel = observer(
	forwardRef<CarouselRef, IProps>(({ items, rowCount, isLoading }, ref) => {
		const options: EmblaOptionsType = { align: 'start', slidesToScroll: 'auto' }
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
			<>
				{isLoading ? (
					<Loader />
				) : (
					<div className='embla w-full select-none'>
						<div className='embla__viewport pt-2' ref={emblaRef}>
							<div className='embla__container gap-1 touch-pan-y touch-pinch-zoom'>
								{items.length > 0 &&
									Array.from({
										length: Math.ceil(items.length / rowCount),
									}).map((_, idx) => (
										<div
											className='flex-[0_0_100%] md:flex-[0_0_33%] px-1'
											key={idx}
										>
											<div className={`grid grid-rows-${rowCount} gap-4`}>
												{items
													.slice(idx * rowCount, idx * rowCount + rowCount)
													.map(review => (
														<ReviewItem review={review} key={review.id} />
													))}
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				)}
			</>
		)
	})
)

export default LastReviewsCarousel
