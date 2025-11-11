import { useQuery } from '@tanstack/react-query'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { FC } from 'react'
import { AuthorAPI } from '../../../../api/author/author-api'
import AuthorCard from '../../../../components/author/authors-grid/Author-card'
import { profileKeys } from '../../../../query-keys/profile-keys'

interface IProps {
	userId: string
}

const options: EmblaOptionsType = { dragFree: true, align: 'start' }

const ProfileAuthorCardsGrid: FC<IProps> = ({ userId }) => {
	const [emblaRef] = useEmblaCarousel(options)

	const queryKey = profileKeys.authorCards(userId)
	const { data: authorCards, isLoading } = useQuery({
		queryKey,
		queryFn: () => AuthorAPI.fetchAuthors(null, null, null, null, true, userId),
		enabled: !!userId,
		staleTime: 1000 * 60 * 5,
	})

	return (
		<div className='embla w-full'>
			<div className='embla__viewport w-full' ref={emblaRef}>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-3 w-full'>
					{isLoading
						? Array.from({ length: 5 }).map((_, idx) => (
								<AuthorCard
									key={`Skeleton-author-card-${idx}`}
									isLoading={true}
								/>
						  ))
						: authorCards?.authors.map(author => (
								<AuthorCard key={author.id} author={author} isLoading={false} />
						  ))}
				</div>
			</div>
		</div>
	)
}

export default ProfileAuthorCardsGrid
