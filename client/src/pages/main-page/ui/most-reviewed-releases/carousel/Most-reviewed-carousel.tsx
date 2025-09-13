import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { FC } from 'react'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { IRelease } from '../../../../../models/release/release.ts'
import MostReviewedCarouselItem from './Most-reviewed-carousel-item'

interface IProps {
	items: IRelease[]
	isLoading: boolean
	setShow: (val: boolean) => void
	setIndex: (val: number) => void
}

const MostReviewedCarousel: FC<IProps> = ({
	setShow,
	setIndex,
	items,
	isLoading,
}) => {
	const options: EmblaOptionsType = { dragFree: true, align: 'start' }
	const [emblaRef] = useEmblaCarousel(options)

	return (
		<div className='embla w-full'>
			<div className='embla__viewport pt-2 px-1.5' ref={emblaRef}>
				<div className='embla__container justify-start gap-x-1 lg:gap-x-7'>
					{isLoading
						? // SKELETON VIEW
						  Array.from({ length: 15 }).map((_, index) => (
								<SkeletonLoader
									key={`skeleton-${index}`}
									className='rounded-full flex-[0_0_64px] aspect-square'
								>
									<div className='opacity-0 w-13 lg:w-17'>_</div>
								</SkeletonLoader>
						  ))
						: // ITEM VIEW
						  items.map((release, index) => (
								<MostReviewedCarouselItem
									key={release.id}
									release={release}
									onClick={() => {
										setIndex(index)
										setShow(true)
									}}
								/>
						  ))}
				</div>
			</div>
		</div>
	)
}

export default MostReviewedCarousel
