import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { AuthorCommentAPI } from '../../../../api/author/author-comment-api'
import AuthorCommentColorSvg from '../../../../components/author/author-comment/svg/Author-comment-color-svg'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { SortOrdersEnum } from '../../../../models/sort/sort-orders-enum'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorCommentsCarousel from './carousel/Author-comments-carousel'

const LIMIT = 15
const OFFSET = 0
const ORDER = SortOrdersEnum.DESC

const queryKey = [
	'authorComments',
	{ limit: LIMIT, offset: OFFSET, order: ORDER, authorId: null },
] as const

const queryFn = () => AuthorCommentAPI.fetchAll(LIMIT, OFFSET, ORDER, null)

const AuthorComments = () => {
	const { navigateToAuthorComments } = useNavigationPath()

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.comments ?? []

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
					items={items}
					isLoading={isPending}
					onCanScrollPrevChange={setCanScrollPrev}
					onCanScrollNextChange={setCanScrollNext}
				/>
			}
			canScrollNext={canScrollNext}
			canScrollPrev={canScrollPrev}
		/>
	)
}

export default AuthorComments
