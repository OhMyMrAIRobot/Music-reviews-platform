import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { UserFavReviewAPI } from '../../../../api/review/user-fav-review-api'
import AuthorLikeColorSvg from '../../../../components/author/author-like/svg/Author-like-color-svg'
import CarouselContainer from '../../../../components/carousel/Carousel-container'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { authorLikesKeys } from '../../../../query-keys/author-likes-keys'
import { CarouselRef } from '../../../../types/common/types/carousel-ref'
import { AuthorLikesQuery } from '../../../../types/review'
import AuthorLikesCarousel from './carousel/Author-likes-carousel'

const query: AuthorLikesQuery = {
	limit: 20,
	offset: 0,
}

const AuthorLikes = () => {
	const { navigateToAuthorLikes } = useNavigationPath()

	const { data, isPending } = useQuery({
		queryKey: authorLikesKeys.list(query),
		queryFn: () => UserFavReviewAPI.findAuthorLikes(query),
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
					Понравилось авторам
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
