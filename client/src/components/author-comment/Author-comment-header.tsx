import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../hooks/use-navigation-path'
import { IAuthorComment } from '../../models/author-comment/author-comment'
import RegisteredAuthorTypes from '../registered-author/Registered-author-types'
import RegisteredAuthorWrittenComments from '../registered-author/Registered-author-written-comments'
import ReviewAuthor from '../review/review-card/Review-author'
import ReviewUserImage from '../review/review-card/Review-user-image'

interface IProps {
	comment: IAuthorComment
	showRelease?: boolean
}

const AuthorCommentHeader: FC<IProps> = ({ comment, showRelease = false }) => {
	const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath()

	return (
		<div className='bg-white/7 p-2 rounded-[12px] flex w-full items-center'>
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
						to={navigatoToProfile(comment.userId)}
						className='text-sm lg:text-lg font-semibold max-w-42 text-ellipsis whitespace-nowrap overflow-hidden'
					>
						<ReviewAuthor
							nickname={comment.nickname}
							position={comment.position}
						/>
					</Link>
					<RegisteredAuthorTypes
						className={'size-5'}
						types={comment.authorTypes}
					/>
					<RegisteredAuthorWrittenComments
						count={comment.totalComments}
						iconClassname='size-5'
					/>
				</div>
			</div>

			{showRelease && (
				<Link
					to={navigateToReleaseDetails(comment.releaseId)}
					className='shrink-0 size-10 lg:size-11 rounded-md z-10 block'
				>
					<img
						loading='lazy'
						decoding='async'
						alt={comment.releaseId}
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							comment.releaseImg === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: comment.releaseImg
						}`}
						className='size-full aspect-square rounded-md'
					/>
				</Link>
			)}
		</div>
	)
}

export default AuthorCommentHeader
