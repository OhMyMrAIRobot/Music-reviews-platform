import { FC } from 'react'
import AuthorCommentHeader from '../../../../components/author/author-comment/Author-comment-header'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { IAuthorComment } from '../../../../models/author/author-comment/author-comment'

interface IProps {
	isLoading: boolean
	comment?: IAuthorComment
}

const ReleaseDetailsAuthorCommentItem: FC<IProps> = ({
	isLoading,
	comment,
}) => {
	return isLoading || !comment ? (
		<SkeletonLoader
			className={'w-full rounded-[15px] lg:rounded-[20px] h-80'}
		/>
	) : (
		<div className='bg-zinc-900/60 p-1.5 lg:p-[5px] flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full relative'>
			<div className='absolute h-full w-8/12 bg-gradient-to-bl from-blue-600 opacity-15 z-0 to-50% origin-top-right transition-all duration-500 right-0 top-0 rounded-[15px] lg:rounded-[20px]' />
			<AuthorCommentHeader comment={comment} />

			<div className='overflow-hidden px-1.5 mb-4'>
				<h6 className='text-base lg:text-lg mt-3 mb-2 font-semibold break-words'>
					{comment.title}
				</h6>
				<p className='text-[15px] lg:text-lg lg:leading-[32px] font-light track tracking-[-0.2px] break-words'>
					{comment.text}
				</p>
				<div className='text-xs opacity-60 mt-2'>{comment.createdAt}</div>
			</div>
		</div>
	)
}

export default ReleaseDetailsAuthorCommentItem
