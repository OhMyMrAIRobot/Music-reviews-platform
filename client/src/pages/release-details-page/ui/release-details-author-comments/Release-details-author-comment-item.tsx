import { FC } from 'react'
import { Link } from 'react-router'
import RegisteredAuthorTypeIcon from '../../../../components/registered-author/Registered-author-type-icon'
import RegisteredAuthorWrittenComments from '../../../../components/registered-author/Registered-author-written-comments'
import ReviewAuthor from '../../../../components/review/review-card/Review-author'
import ReviewUserImage from '../../../../components/review/review-card/Review-user-image'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { IAuthorComment } from '../../../../models/author-comment/author-comment'

interface IProps {
	isLoading: boolean
	comment?: IAuthorComment
}

const ReleaseDetailsAuthorCommentItem: FC<IProps> = ({
	isLoading,
	comment,
}) => {
	const { navigatoToProfile } = useNavigationPath()

	return isLoading || !comment ? (
		<SkeletonLoader
			className={'w-full rounded-[15px] lg:rounded-[20px] h-80'}
		/>
	) : (
		<div className='bg-zinc-900/60 p-1.5 lg:p-[5px] flex flex-col mx-auto border border-zinc-800 rounded-[15px] lg:rounded-[20px] w-full'>
			<div className='bg-white/7 p-2 rounded-[12px] flex gap-3'>
				<div className='flex items-center gap-x-3 w-full'>
					<Link to={navigatoToProfile(comment.userId)}>
						<ReviewUserImage
							nickname={comment.nickname}
							img={comment.avatar}
							points={comment.points}
						/>
					</Link>
					<div className='flex items-center gap-1.5'>
						<Link
							to={navigatoToProfile(comment.id)}
							className='text-sm lg:text-lg font-semibold max-w-42 text-ellipsis whitespace-nowrap overflow-hidden'
						>
							<ReviewAuthor
								nickname={comment.nickname}
								position={comment.position}
							/>
						</Link>
						{comment.authorTypes.map(type => (
							<RegisteredAuthorTypeIcon
								key={type.id}
								className={'size-5'}
								type={type.type}
							/>
						))}
						<RegisteredAuthorWrittenComments
							count={comment.totalComments}
							iconClassname='size-5'
						/>
					</div>
				</div>
			</div>

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
