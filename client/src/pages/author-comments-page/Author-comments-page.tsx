import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import AuthorComment from '../../components/author/author-comment/Author-comment'
import AuthorCommentColorSvg from '../../components/author/author-comment/svg/Author-comment-color-svg'
import ComboBox from '../../components/buttons/Combo-box'
import Pagination from '../../components/pagination/Pagination'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { ReviewSortFields } from '../../models/review/review-sort-fields'
import { SortOrdersEnum } from '../../models/sort/sort-orders-enum'

const AuthorCommentsPage = observer(() => {
	const perPage = 12

	const { authorCommentsPageStore } = useStore()

	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewSortFields.NEW
	)

	const { execute: fetch, isLoading } = useLoading(
		authorCommentsPageStore.fetchAuthorComments
	)

	useEffect(() => {
		fetch(
			perPage,
			(currentPage - 1) * perPage,
			selectedOrder === ReviewSortFields.NEW
				? SortOrdersEnum.DESC
				: SortOrdersEnum.ASC
		)
	}, [currentPage, fetch, selectedOrder])

	return (
		<>
			<div className='flex items-center gap-x-2.5'>
				<AuthorCommentColorSvg className='size-8' />
				<h1
					id='author-comments'
					className='text-lg md:text-xl lg:text-3xl font-semibold'
				>
					Авторские комментарии
				</h1>
			</div>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 flex gap-4 items-center'>
				<span className='hidden sm:block text-white/70 font-bold '>
					Сортировать по:
				</span>
				<div className='w-full sm:w-55'>
					<ComboBox
						options={Object.values(ReviewSortFields)}
						onChange={setSelectedOrder}
						className='border border-white/10'
						value={selectedOrder}
					/>
				</div>
			</div>

			<section className='mt-5 overflow-hidden py-2'>
				<div className='gap-3 xl:gap-5 grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1'>
					{isLoading
						? Array.from({ length: perPage }).map((_, idx) => (
								<AuthorComment
									key={`skeleton-author-comment-${idx}`}
									isLoading={true}
								/>
						  ))
						: authorCommentsPageStore.authorComments.map(comment => (
								<AuthorComment
									key={comment.id}
									comment={comment}
									isLoading={false}
								/>
						  ))}

					{authorCommentsPageStore.authorComments.length === 0 &&
						!isLoading && (
							<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
								Авторские комментарии не найдены!
							</p>
						)}
				</div>
			</section>

			{authorCommentsPageStore.authorComments.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={authorCommentsPageStore.count}
						itemsPerPage={perPage}
						setCurrentPage={setCurrentPage}
						idToScroll={'author-comments'}
					/>
				</div>
			)}
		</>
	)
})

export default AuthorCommentsPage
