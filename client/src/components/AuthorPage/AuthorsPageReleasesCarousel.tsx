import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../hooks/UseLoading'
import { useStore } from '../../hooks/UseStore'
import LastReleasesCarousel, {
	CarouselRef,
} from '../carousel/lastReleases/LastReleasesCarousel'
import MainCarouselSection from '../container/MainCarouselSection'

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
		<MainCarouselSection
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
