import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorDetailsNominationsCarousel from './Author-details-nominations-carousel'

interface IProps {
	id: string
}

const AuthorDetailsNominations: FC<IProps> = observer(({ id }) => {
	const { authorDetailsPageStore } = useStore()

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchNominations
	)

	useEffect(() => {
		fetch(id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	return (
		(isLoading || authorDetailsPageStore.nominations.length > 0) && (
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
						isLoading={isLoading}
						onCanScrollPrevChange={setCanScrollPrev}
						onCanScrollNextChange={setCanScrollNext}
						items={authorDetailsPageStore.nominations}
					/>
				}
			/>
		)
	)
})

export default AuthorDetailsNominations
