import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { FC } from 'react'
import AuthorCard from '../../../../components/author/authors-grid/Author-card'
import { useStore } from '../../../../hooks/use-store'

interface IProps {
	isLoading: boolean
}

const ProfileAuthorCardsGrid: FC<IProps> = ({ isLoading }) => {
	const { profilePageStore } = useStore()

	const options: EmblaOptionsType = { dragFree: true, align: 'start' }
	const [emblaRef] = useEmblaCarousel(options)

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
						: profilePageStore.authorCards.map(author => (
								<AuthorCard key={author.id} author={author} isLoading={false} />
						  ))}
				</div>
			</div>
		</div>
	)
}

export default ProfileAuthorCardsGrid
