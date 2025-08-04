import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { CarouselRef } from '../../../types/carousel-ref'
import LastReleasesCarousel from '../../main-page/ui/last-releases/carousel/Last-releases-carousel'

const AuthorDetailsReleasesCarousel = observer(() => {
	const { id } = useParams()

	const { authorDetailsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchTopReleases
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [fetch, id])

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={'Лучшие работы'}
			buttonTitle={''}
			showButton={false}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			href='#'
			carousel={
				<LastReleasesCarousel
					items={authorDetailsPageStore.topReleases}
					isLoading={isLoading}
					ref={carouselRef}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
})

export default AuthorDetailsReleasesCarousel
