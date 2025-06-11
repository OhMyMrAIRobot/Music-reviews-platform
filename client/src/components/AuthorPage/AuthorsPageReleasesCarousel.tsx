import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
import LastReleasesCarousel from '../../pages/main-page/ui/last-releases/carousel/Last-releases-carousel'
import { CarouselRef } from '../../types/carousel-ref'
import CarouselContainer from '../carousel/Carousel-container'

const AuthorsPageReleasesCarousel = observer(() => {
	const { id } = useParams()
	const carouselRef = useRef<CarouselRef>(null)

	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	const { authorPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorPageStore.fetchTopReleases
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [])

	return (
		<CarouselContainer
			title={'Лучшие работы'}
			buttonTitle={''}
			showButton={false}
			onButtonClick={() => {}}
			handlePrev={handlePrev}
			handleNext={handleNext}
			Carousel={
				<LastReleasesCarousel
					items={authorPageStore.topReleases}
					isLoading={isLoading}
					ref={carouselRef}
				/>
			}
		/>
	)
})

export default AuthorsPageReleasesCarousel
