import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { AuthorCommentAPI } from '../../../../api/author/author-comment-api'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys'
import { AuthorCommentsQuery } from '../../../../types/author'
import { SortOrdersEnum } from '../../../../types/common/enums/sort-orders-enum'
import ReleaseDetailsAuthorCommentItem from './Release-details-author-comment-item'

interface IProps {
	releaseId: string
}

const ReleaseDetailsAuthorComments: FC<IProps> = ({ releaseId }) => {
	const query: AuthorCommentsQuery = {
		releaseId,
		sortOrder: SortOrdersEnum.DESC,
	}

	const { data, isPending: isFetching } = useQuery({
		queryKey: authorCommentsKeys.list(query),
		queryFn: () => AuthorCommentAPI.findAll(query),
		staleTime: 1000 * 60 * 5,
	})

	const authorComments = data?.items

	return (
		(isFetching || (authorComments && authorComments.length > 0)) && (
			<section className='w-full grid grid-cols-1 mt-5 lg:mt-10'>
				<div className='font-bold flex items-center gap-x-5 h-full'>
					<p className='text-xl xl:text-2xl '>Комментарии авторов</p>

					{isFetching ? (
						<SkeletonLoader className={'rounded-full size-10 lg:size-12'} />
					) : (
						<div className='inline-flex items-center justify-center rounded-full size-10 lg:size-12 bg-white/5 select-none'>
							{authorComments?.length || 0}
						</div>
					)}
				</div>

				<div className='grid grid-cols-1 max-w-200 w-full mx-auto gap-5 mt-5'>
					{isFetching
						? Array.from({ length: 3 }).map((_, idx) => (
								<ReleaseDetailsAuthorCommentItem
									key={`Skeleton-author-com-${idx}`}
									isLoading={true}
								/>
						  ))
						: authorComments?.map(comment => (
								<ReleaseDetailsAuthorCommentItem
									key={comment.id}
									isLoading={false}
									comment={comment}
								/>
						  ))}
				</div>
			</section>
		)
	)
}

export default ReleaseDetailsAuthorComments
