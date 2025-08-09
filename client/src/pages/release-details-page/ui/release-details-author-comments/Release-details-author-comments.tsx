import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import ReleaseDetailsAuthorCommentItem from './Release-details-author-comment-item'

interface IProps {
	releaseId: string
}

const ReleaseDetailsAuthorComments: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore } = useStore()

	const { execute: fetchComments, isLoading: isFetching } = useLoading(
		releaseDetailsPageStore.fetchAuthorComments
	)

	useEffect(() => {
		fetchComments(releaseId)
	}, [fetchComments, releaseId])

	return (
		(isFetching || releaseDetailsPageStore.authorComments.length > 0) && (
			<section className='w-full grid grid-cols-1 mt-5 lg:mt-10'>
				<div className='font-bold flex items-center gap-x-5 h-full'>
					<p className='text-xl xl:text-2xl '>Комментарии авторов</p>

					{isFetching ? (
						<SkeletonLoader className={'rounded-full size-10 lg:size-12'} />
					) : (
						<div className='inline-flex items-center justify-center rounded-full size-10 lg:size-12 bg-white/5 select-none'>
							{releaseDetailsPageStore.authorComments.length}
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
						: releaseDetailsPageStore.authorComments.map(comment => (
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
})

export default ReleaseDetailsAuthorComments
