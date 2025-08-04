import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { CarouselRef } from '../../../types/carousel-ref'
import LastReleasesCarousel from '../../main-page/ui/last-releases/carousel/Last-releases-carousel'

const AuthorDetailsReleasesCarousel = observer(() => {
	const { id } = useParams()

	const { authorDetailsPageStore } = useStore()

	const carouselRef = useRef<CarouselRef>(null)

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchTopReleases
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [fetch, id])

	return (
		<CarouselContainer
			title={'Лучшие работы'}
			buttonTitle={''}
			showButton={false}
			onButtonClick={() => {}}
			handlePrev={() => {
				carouselRef.current?.scrollPrev()
			}}
			handleNext={() => {
				carouselRef.current?.scrollNext()
			}}
			carousel={
				<LastReleasesCarousel
					items={authorDetailsPageStore.topReleases}
					isLoading={isLoading}
					ref={carouselRef}
				/>
			}
		/>
	)
})

export default AuthorDetailsReleasesCarousel
