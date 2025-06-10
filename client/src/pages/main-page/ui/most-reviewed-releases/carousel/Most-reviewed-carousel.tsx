import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { useLoading } from '../../../../../hooks/UseLoading'
import { useStore } from '../../../../../hooks/UseStore'
import MostReviewedCarouselItem from './Most-reviewed-carousel-item'

interface IProps {
	setShow: (val: boolean) => void
	setIndex: (val: number) => void
}

const MostReviewedCarousel: FC<IProps> = observer(({ setShow, setIndex }) => {
	const options: EmblaOptionsType = { dragFree: true, align: 'start' }
	const [emblaRef] = useEmblaCarousel(options)

	const { releasesStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		releasesStore.fetchTopReleases
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	return (
		<div className='embla w-full'>
			<div className='embla__viewport pt-2 px-1.5' ref={emblaRef}>
				<div className='embla__container justify-start gap-x-1 lg:gap-x-7'>
					{isLoading
						? // SCELETON VIEW
						  Array.from({ length: 15 }).map((_, index) => (
								<div
									key={`skeleton-${index}`}
									className='bg-gray-400 rounded-full embla__slide flex-[0_0_64px] animate-pulse aspect-square opacity-40'
								>
									<div className='opacity-0 w-13 lg:w-17'>_</div>
								</div>
						  ))
						: // ITEM VIEW
						  releasesStore.topReleases.map((release, index) => (
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
})

export default MostReviewedCarousel
