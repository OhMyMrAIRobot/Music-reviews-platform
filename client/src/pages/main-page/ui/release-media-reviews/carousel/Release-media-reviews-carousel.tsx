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
import ReleaseMediaReview from '../../../../../components/release-media/Release-media-review'
import { IReleaseMedia } from '../../../../../models/release/release-media/release-media'
import { CarouselRef } from '../../../../../types/carousel-ref'
import { CarouselStateCallbacks } from '../../../../../types/carousel-state-callbacks'
import mainPageStore from '../../../store/main-page-store'

interface IProps extends CarouselStateCallbacks {
	items: IReleaseMedia[]
	isLoading: boolean
}

const ReleaseMediaReviewsCarousel = observer(
	forwardRef<CarouselRef, IProps>(
		(
			{ items, isLoading, onCanScrollPrevChange, onCanScrollNextChange },
			ref
		) => {
			const options: EmblaOptionsType = {
				align: 'start',
				slidesToScroll: 1,
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
				<div className='embla w-full'>
					<div ref={emblaRef} className='embla__viewport pt-2'>
						<div className='embla__container gap-3 touch-pan-y touch-pinch-zoom'>
							{isLoading
								? Array.from({ length: 10 }).map((_, idx) => (
										<div
											className='flex-[0_0_100%] md:flex-[0_0_450px] md:max-w-[450px]'
											key={`skeleton-release-media-${idx}`}
										>
											<ReleaseMediaReview isLoading={isLoading} />
										</div>
								  ))
								: items.map(item => (
										<div
											className='flex-[0_0_100%] md:flex-[0_0_450px] md:max-w-[450px]'
											key={item.id}
										>
											<ReleaseMediaReview
												isLoading={isLoading}
												media={item}
												toggleFav={mainPageStore.toggleFavMedia}
											/>
										</div>
								  ))}
						</div>
					</div>
				</div>
			)
		}
	)
)

export default ReleaseMediaReviewsCarousel
