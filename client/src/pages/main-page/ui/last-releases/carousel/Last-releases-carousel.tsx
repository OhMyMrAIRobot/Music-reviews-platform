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
import ReleaseCard from '../../../../../components/release/Release-card'
import { IRelease } from '../../../../../models/release/release'
import { CarouselRef } from '../../../../../types/carousel-ref'
import { CarouselStateCallbacks } from '../../../../../types/carousel-state-callbacks'

interface IProps extends CarouselStateCallbacks {
	items: IRelease[]
	isLoading: boolean
}

const LastReleasesCarousel = observer(
	forwardRef<CarouselRef, IProps>(
		(
			{ items, isLoading, onCanScrollPrevChange, onCanScrollNextChange },
			ref
		) => {
			const options: EmblaOptionsType = { align: 'start', slidesToScroll: 1 }
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
						<div className='embla__container gap-1 touch-pan-y touch-pinch-zoom'>
							{isLoading
								? // SCELETON VIEW
								  Array.from({ length: 15 }).map((_, index) => (
										<div
											key={`last-rel-skeleton-${index}`}
											className='flex-[0_0_160px] px-1 py-1.5 min-w-0 min-h-64'
										>
											<ReleaseCard isLoading={isLoading} />
										</div>
								  ))
								: // ITEM VIEW
								  items.map(release => (
										<div
											key={`${release.id}`}
											className='flex-[0_0_160px] px-1 py-1.5 min-w-0'
										>
											<ReleaseCard release={release} isLoading={isLoading} />
										</div>
								  ))}
						</div>
					</div>
				</div>
			)
		}
	)
)

export default LastReleasesCarousel
