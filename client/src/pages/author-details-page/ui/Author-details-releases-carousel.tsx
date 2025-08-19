import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { CarouselRef } from '../../../types/carousel-ref'
import LastReleasesCarousel from '../../main-page/ui/last-releases/carousel/Last-releases-carousel'

interface IProps {
	id: string
}

const AuthorDetailsReleasesCarousel: FC<IProps> = observer(({ id }) => {
	const { authorDetailsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchTopReleases
	)

	useEffect(() => {
		fetch(id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		(isLoading || authorDetailsPageStore.topReleases.length > 0) && (
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
	)
})

export default AuthorDetailsReleasesCarousel
