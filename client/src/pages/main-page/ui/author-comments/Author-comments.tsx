import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import WrittenCommentsSvg from '../../../../components/registered-author/svg/Written-comments-svg'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorCommentsCarousel from './carousel/Author-comments-carousel'

const AuthorComments = observer(() => {
	const { mainPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		mainPageStore.fetchAuthorComments
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	const carouselRef = useRef<CarouselRef>(null)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)

	return (
		<CarouselContainer
			title={
				<div className='flex items-center gap-x-2'>
					<WrittenCommentsSvg className='size-8' />
					Авторские комментарии
				</div>
			}
			buttonTitle={'Все авторские комментарии'}
			showButton={true}
			href={'#'}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<AuthorCommentsCarousel
					ref={carouselRef}
					items={mainPageStore.authorComments}
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

export default AuthorComments
