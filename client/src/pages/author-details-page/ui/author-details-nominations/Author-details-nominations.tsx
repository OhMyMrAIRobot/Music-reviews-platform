import { useQuery } from '@tanstack/react-query'
import { FC, useRef, useState } from 'react'
import { NominationAPI } from '../../../../api/nomination-api'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { nominationsKeys } from '../../../../query-keys/nominations-keys'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorDetailsNominationsCarousel from './Author-details-nominations-carousel'

interface IProps {
	id: string
}

const AuthorDetailsNominations: FC<IProps> = ({ id }) => {
	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	const { data, isPending } = useQuery({
		queryKey: nominationsKeys.byAuthor(id),
		queryFn: () => NominationAPI.fetchWinnersByAuthorId(id),
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.nominations ?? []

	return (
		(isPending || items.length > 0) && (
			<CarouselContainer
				title={'Победитель номинаций'}
				buttonTitle={'#'}
				showButton={false}
				href={'#'}
				handlePrev={() => carouselRef.current?.scrollPrev()}
				handleNext={() => carouselRef.current?.scrollNext()}
				canScrollNext={canScrollNext}
				canScrollPrev={canScrollPrev}
				carousel={
					<AuthorDetailsNominationsCarousel
						ref={carouselRef}
						isLoading={isPending}
						onCanScrollPrevChange={setCanScrollPrev}
						onCanScrollNextChange={setCanScrollNext}
						items={items}
					/>
				}
			/>
		)
	)
}

export default AuthorDetailsNominations
