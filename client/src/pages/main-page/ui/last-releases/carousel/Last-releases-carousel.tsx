import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { forwardRef, useImperativeHandle } from 'react'
import ReleaseCard from '../../../../../components/release/Release-card'
import { IRelease } from '../../../../../models/release/release'
import { CarouselRef } from '../../../../../types/carousel-ref'

interface IProps {
	items: IRelease[]
	isLoading: boolean
}

const LastReleasesCarousel = observer(
	forwardRef<CarouselRef, IProps>(({ items, isLoading }, ref) => {
		const options: EmblaOptionsType = { align: 'start', slidesToScroll: 2 }
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
	})
)

export default LastReleasesCarousel
