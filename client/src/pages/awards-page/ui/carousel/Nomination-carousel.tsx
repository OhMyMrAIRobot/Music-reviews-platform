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
import { NominationWinner } from '../../../../models/nomination/nomination-winner/nomination-winner'
import { CarouselRef } from '../../../../types/carousel-ref'
import { CarouselStateCallbacks } from '../../../../types/carousel-state-callbacks'
import NominationWinnerCard from './Nomination-winner'

interface IProps extends CarouselStateCallbacks {
	items?: NominationWinner[]
	isLoading: boolean
}

const NominationCarousel = observer(
	forwardRef<CarouselRef, IProps>(
		(
			{ items, isLoading, onCanScrollPrevChange, onCanScrollNextChange },
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
							{isLoading || !items
								? Array.from({ length: 5 }).map((_, idx) => (
										<div
											className='flex-[0_0_230px] lg:flex-[0_0_300px] px-2 pb-2'
											key={`Nomination-skeleton-${idx}`}
										>
											<NominationWinnerCard isLoading={true} />
										</div>
								  ))
								: items.map(item => (
										<div
											className='flex-[0_0_230px] lg:flex-[0_0_300px] px-2 pb-2'
											key={item.type}
										>
											<NominationWinnerCard isLoading={false} item={item} />
										</div>
								  ))}
						</div>
					</div>
				</div>
			)
		}
	)
)

export default NominationCarousel
