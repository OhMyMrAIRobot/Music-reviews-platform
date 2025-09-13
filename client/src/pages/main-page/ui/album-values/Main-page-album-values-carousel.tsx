import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react'
import AlbumValueCard from '../../../../components/album-value/Album-value-card'
import { IAlbumValue } from '../../../../models/album-value/album-value'
import { CarouselRef } from '../../../../types/carousel-ref'
import { CarouselStateCallbacks } from '../../../../types/carousel-state-callbacks'

interface IProps extends CarouselStateCallbacks {
	isLoading: boolean
	items: IAlbumValue[]
}

const MainPageAlbumValuesCarousel = forwardRef<CarouselRef, IProps>(
	({ items, isLoading, onCanScrollPrevChange, onCanScrollNextChange }, ref) => {
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
										className='flex-[0_0_180px]'
										key={`skeleton-author-comment-${idx}`}
									>
										<AlbumValueCard isLoading={isLoading} smallSize={true} />
									</div>
							  ))
							: items.map(item => (
									<div className='flex-[0_0_180px]' key={item.release.id}>
										<AlbumValueCard
											isLoading={isLoading}
											value={item}
											smallSize={true}
										/>
									</div>
							  ))}
					</div>
				</div>
			</div>
		)
	}
)

export default MainPageAlbumValuesCarousel
