import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import AuthorLikeColorSvg from '../../../../components/registered-author/svg/Author-like-color-svg'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorLikesCarousel from './carousel/Author-likes-carousel'

const AuthorLikes = observer(() => {
	const { mainPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		mainPageStore.fetchAuthorLikes
	)

	useEffect(() => {
		fetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={
				<div className='flex items-center gap-x-2'>
					<AuthorLikeColorSvg className='size-8' />
					Авторские комментарии
				</div>
			}
			buttonTitle={'Все авторские лайки'}
			showButton={true}
			href={'#'}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<AuthorLikesCarousel
					ref={carouselRef}
					items={mainPageStore.authorLikes}
					isLoading={isLoading}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
})

export default AuthorLikes
