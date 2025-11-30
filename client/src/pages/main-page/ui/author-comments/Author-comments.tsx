import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { AuthorCommentAPI } from '../../../../api/author/author-comment-api'
import AuthorCommentColorSvg from '../../../../components/author/author-comment/svg/Author-comment-color-svg'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys'
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum'
import { CarouselRef } from '../../../../types/common/types/carousel-ref'
import AuthorCommentsCarousel from './carousel/Author-comments-carousel'

const limit = 15
const offset = 0
const order = SortOrdersEnum.DESC

const queryKey = authorCommentsKeys.list({
	limit,
	offset,
	order,
	authorId: null,
})

const queryFn = () =>
	AuthorCommentAPI.findAll({ limit, offset, sortOrder: order })

const AuthorComments = () => {
	const { navigateToAuthorComments } = useNavigationPath()

	const { data, isPending } = useQuery({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data?.items ?? []

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
