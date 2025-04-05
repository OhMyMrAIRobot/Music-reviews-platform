import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
import TopReleaseCarouselItem from './TopReleaseCarouselItem'

const TopReleaseCarousel = observer(() => {
	const options: EmblaOptionsType = { dragFree: true }
	const [emblaRef] = useEmblaCarousel(options)

	const { releasesStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		releasesStore.fetchTopReleases
	)

	useEffect(() => {
		fetch()
	}, [])

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className='embla'>
					<div className='embla__viewport pt-2 px-1.5' ref={emblaRef}>
						<div className='embla__container '>
							{releasesStore.topReleases.map(release => (
								<TopReleaseCarouselItem
									key={release.id}
									id={release.id}
									img={release.img}
									title={release.title}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
})

export default TopReleaseCarousel
