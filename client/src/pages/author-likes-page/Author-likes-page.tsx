import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorLikeCard from '../../components/author/author-like/Author-like-card'
import AuthorLikeColorSvg from '../../components/author/author-like/svg/Author-like-color-svg'
import Pagination from '../../components/pagination/Pagination'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'

const AuthorLikesPage = observer(() => {
	const perPage = 18

	const { authorLikesPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorLikesPageStore.fetchAuthorLikes
	)

	const [currentPage, setCurrentPage] = useState<number>(1)

	useEffect(() => {
		fetch(perPage, (currentPage - 1) * perPage)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage])

	return (
		<>
			<div className='flex items-center gap-x-2.5'>
				<AuthorLikeColorSvg className='size-8' />
				<h1
					id='author-likes'
					className='text-lg md:text-xl lg:text-3xl font-semibold'
				>
					Понравилось авторам
				</h1>
			</div>

			<section className='mt-5 py-2'>
				<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1'>
					{isLoading
						? Array.from({ length: perPage }).map((_, idx) => (
								<AuthorLikeCard
									key={`Skeleton-author-like-${idx}`}
									isLoading={true}
								/>
						  ))
						: authorLikesPageStore.authorLikes.map(like => (
								<div
									className='overflow-hidden'
									key={like.author.id + like.reviewAuthor.id}
								>
									<AuthorLikeCard authorLike={like} isLoading={false} />
								</div>
						  ))}

					{authorLikesPageStore.authorLikes.length === 0 && !isLoading && (
						<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
							Авторские лайки не найдены!
						</p>
					)}
				</div>
			</section>

			{authorLikesPageStore.authorLikes.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={authorLikesPageStore.count}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll={'author-likes'}
					/>
				</div>
			)}
		</>
	)
})

export default AuthorLikesPage
