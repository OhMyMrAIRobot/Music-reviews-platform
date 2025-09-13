import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthorCommentAPI } from '../../api/author/author-comment-api'
import AuthorComment from '../../components/author/author-comment/Author-comment'
import AuthorCommentColorSvg from '../../components/author/author-comment/svg/Author-comment-color-svg'
import ComboBox from '../../components/buttons/Combo-box'
import Pagination from '../../components/pagination/Pagination'
import { ReviewSortFields } from '../../models/review/review-sort-fields'
import { SortOrdersEnum } from '../../models/sort/sort-orders-enum'

const PER_PAGE = 12

const AuthorCommentsPage = () => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [selectedOrder, setSelectedOrder] = useState<string>(
		ReviewSortFields.NEW
	)

	const limit = PER_PAGE
	const offset = (currentPage - 1) * PER_PAGE
	const orderParam =
		selectedOrder === ReviewSortFields.NEW
			? SortOrdersEnum.DESC
			: SortOrdersEnum.ASC

	const { data, isPending } = useQuery({
		queryKey: ['authorComments', { limit, offset, order: orderParam }],
		queryFn: () => AuthorCommentAPI.fetchAll(limit, offset, orderParam, null),
		staleTime: 1000 * 60 * 5,
	})

	const comments = data?.comments ?? []
	const totalCount = data?.count ?? 0

	return (
		<>
			<div className='flex items-center gap-x-2.5'>
				<AuthorCommentColorSvg className='size-8' />
				<h1 id='author-comments' className='text-2xl lg:text-3xl font-semibold'>
					Авторские комментарии
				</h1>
			</div>

			<div className='rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-sm mt-5 grid md:flex gap-x-4 items-center'>
				<span className='text-sm md:text-base text-white/70 font-bold max-md:pb-1'>
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
					{isPending
						? Array.from({ length: PER_PAGE }).map((_, idx) => (
								<AuthorComment
									key={`skeleton-author-comment-${idx}`}
									isLoading={true}
								/>
						  ))
						: comments.map(comment => (
								<AuthorComment
									key={comment.id}
									comment={comment}
									isLoading={false}
								/>
						  ))}

					{comments.length === 0 && !isPending && (
						<p className='text-center text-2xl font-semibold mt-10 w-full absolute'>
							Авторские комментарии не найдены!
						</p>
					)}
				</div>
			</section>

			{comments.length > 0 && (
				<div className='mt-20'>
					<Pagination
						currentPage={currentPage}
						totalItems={totalCount}
						itemsPerPage={PER_PAGE}
						setCurrentPage={setCurrentPage}
						idToScroll={'author-comments'}
					/>
				</div>
			)}
		</>
	)
}

export default AuthorCommentsPage
