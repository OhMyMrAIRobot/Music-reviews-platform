import { useQuery } from '@tanstack/react-query'
import { FC, useRef, useState } from 'react'
import { ReleaseAPI } from '../../../api/release/release-api'
import CarouselContainer from '../../../components/carousel/Carousel-container'
import { releasesKeys } from '../../../query-keys/releases-keys'
import { CarouselRef } from '../../../types/carousel-ref'
import LastReleasesCarousel from '../../main-page/ui/last-releases/carousel/Last-releases-carousel'

interface IProps {
	id: string
}

const AuthorDetailsReleasesCarousel: FC<IProps> = ({ id }) => {
	const { data: topReleases, isPending } = useQuery({
		queryKey: releasesKeys.byAuthor(id, false),
		queryFn: () => ReleaseAPI.fetchByAuthorId(id, false),
		staleTime: 1000 * 60 * 5,
	})

	const carouselRef = useRef<CarouselRef>(null)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		(isPending || (topReleases && topReleases.length > 0)) && (
			<CarouselContainer
				title={'Лучшие работы'}
				buttonTitle={''}
				showButton={false}
				handlePrev={() => carouselRef.current?.scrollPrev()}
				handleNext={() => carouselRef.current?.scrollNext()}
				href='#'
				carousel={
					<LastReleasesCarousel
						items={topReleases || []}
						isLoading={isPending}
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
}

export default AuthorDetailsReleasesCarousel
