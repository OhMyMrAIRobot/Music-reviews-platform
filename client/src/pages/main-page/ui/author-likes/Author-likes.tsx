import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { UserFavReviewAPI } from '../../../../api/review/user-fav-review-api'
import AuthorLikeColorSvg from '../../../../components/author/author-like/svg/Author-like-color-svg'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { CarouselRef } from '../../../../types/carousel-ref'
import AuthorLikesCarousel from './carousel/Author-likes-carousel'

const LIMIT = 20
const OFFSET = 0

const queryKey = ['authorLikes', { limit: LIMIT, offset: OFFSET }] as const

const queryFn = () => UserFavReviewAPI.fetchAuthorLikes(LIMIT, OFFSET)

const AuthorLikes = () => {
	const { navigateToAuthorLikes } = useNavigationPath()

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
						<AuthorLikeColorSvg className='size-8' />
					</div>
					Авторские комментарии
				</div>
			}
			buttonTitle={'Все авторские лайки'}
			showButton={true}
			href={navigateToAuthorLikes}
			handlePrev={() => carouselRef.current?.scrollPrev()}
			handleNext={() => carouselRef.current?.scrollNext()}
			carousel={
				<AuthorLikesCarousel
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

export default AuthorLikes
