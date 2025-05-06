import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { forwardRef, useImperativeHandle } from 'react'
import { IRelease } from '../../../models/release/Release'
import Loader from '../../Loader'
import LastReleasesCarouselItem from './LastReleasesCarouselItem'

interface IProps {
	items: IRelease[]
	isLoading: boolean
}

export type CarouselRef = {
	scrollPrev: () => void
	scrollNext: () => void
}

const LastReleasesCarousel = observer(
	forwardRef<CarouselRef, IProps>(({ items, isLoading }, ref) => {
		const options: EmblaOptionsType = { align: 'start', slidesToScroll: 3 }
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
					<div className='embla w-full'>
						<div className='embla__viewport pt-2' ref={emblaRef}>
							<div className='embla__container gap-1 touch-pan-y touch-pinch-zoom'>
								{items.map(release => (
									<div
										key={`${release.id}`}
										className='flex-[0_0_160px] px-1 py-1.5 min-w-0'
									>
										<LastReleasesCarouselItem release={release} />
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

export default LastReleasesCarousel
