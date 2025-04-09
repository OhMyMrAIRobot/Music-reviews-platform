import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import { CarouselRef } from '../lastReleases/LastReleasesCarousel'
import LastReviewsCarouselItem from './LastReviewsCarouselItem'

const LastReviewsCarousel = observer(
	forwardRef<CarouselRef>((_, ref) => {
		const { reviewsStore } = useStore()

		const { execute: fetch, isLoading } = useLoading(
			reviewsStore.fetchLastReviews
		)

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

		useEffect(() => {
			fetch()
		}, [])

		return (
			<>
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<div className='embla w-full select-none'>
						<div className='embla__viewport pt-2' ref={emblaRef}>
							<div className='embla__container gap-1 touch-pan-y touch-pinch-zoom'>
								{reviewsStore.lastReviews.length > 0 &&
									Array.from({
										length: Math.ceil(reviewsStore.lastReviews.length / 3),
									}).map((_, idx) => (
										<div
											className='flex-[0_0_100%] md:flex-[0_0_33%] px-1'
											key={idx}
										>
											<div className='grid grid-rows-3 gap-4'>
												{reviewsStore.lastReviews
													.slice(idx * 3, idx * 3 + 3)
													.map(review => (
														<LastReviewsCarouselItem
															review={review}
															key={review.id}
														/>
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
