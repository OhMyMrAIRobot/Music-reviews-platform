import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import AuthorCommentColorSvg from '../../../../components/author/author-comment/svg/Author-comment-color-svg'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorCommentsCarousel from './carousel/Author-comments-carousel'

const AuthorComments = observer(() => {
	const { mainPageStore } = useStore()

	const { navigateToAuthorComments } = useNavigationPath()

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
					<div className='size-8'>
						<AuthorCommentColorSvg className='size-8' />
					</div>
					Авторские комментарии
				</div>
			}
			buttonTitle={'Все авторские комментарии'}
			showButton={true}
			href={navigateToAuthorComments}
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
