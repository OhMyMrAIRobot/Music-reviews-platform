import { FC } from 'react'
import { IAuthorComment } from '../../../models/author/author-comment/author-comment'
import SkeletonLoader from '../../utils/Skeleton-loader'
import AuthorCommentHeader from './Author-comment-header'

interface IProps {
	comment?: IAuthorComment
	isLoading: boolean
}

const AuthorComment: FC<IProps> = ({ comment, isLoading }) => {
	return isLoading || !comment ? (
		<SkeletonLoader
			className={'w-full rounded-[15px] lg:rounded-[20px] h-62'}
		/>
	) : (
		<div className='bg-zinc-900/60 relative p-1.5 lg:p-2 flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full'>
			<div className='absolute h-full w-8/12 bg-gradient-to-bl from-blue-600 opacity-15 z-0 to-50% group-hover:scale-[120%] origin-top-right transition-all duration-500 right-0 top-0 rounded-[15px] lg:rounded-[20px]' />

			<AuthorCommentHeader comment={comment} showRelease={true} />

			<div className='h-full overflow-hidden px-1.5 text-white'>
				<h6 className='text-base lg:text-lg mt-3 pb-3 font-semibold overflow-hidden text-ellipsis w-full max-w-full whitespace-nowrap'>
					{comment.title}
				</h6>
				<p className='text-[15px] lg:text-base line-clamp-4 break-words overflow-hidden text-ellipsis text-wrap'>
					{comment.text}
				</p>
				<div className='text-xs opacity-60 mt-1'>{comment.createdAt}</div>
			</div>
		</div>
	)
}

export default AuthorComment
