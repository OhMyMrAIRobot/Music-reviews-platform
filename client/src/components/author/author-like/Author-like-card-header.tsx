import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { IAuthorLike } from '../../../models/author/author-likes/author-like'
import Tooltip from '../../tooltip/Tooltip'
import TooltipSpan from '../../tooltip/Tooltip-span'

interface IProps {
	authorLike: IAuthorLike
}

const AuthorLikeCardHeader: FC<IProps> = ({ authorLike }) => {
	const { navigatoToProfile, navigateToReleaseDetails } = useNavigationPath()

	return (
		<div className='relative py-1 px-1.5'>
			<div className='relative flex items-center w-full'>
				<Link
					to={navigatoToProfile(authorLike.reviewAuthor.id)}
					className='shrink-0'
				>
					<img
						loading='lazy'
						decoding='async'
						alt={authorLike.reviewAuthor.nickname}
						src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							authorLike.reviewAuthor.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: authorLike.reviewAuthor.avatar
						}`}
						className='shrink-0 size-10 lg:size-14 border border-white/10 rounded-full object-cover'
					/>
				</Link>

				<span className='ml-2.5 text-sm max-w-30 text-ellipsis font-medium whitespace-nowrap overflow-hidden'>
					{authorLike.reviewAuthor.nickname}
				</span>

				<Link
					to={navigateToReleaseDetails(authorLike.release.id)}
					className='ml-auto z-100'
				>
					<TooltipSpan
						tooltip={<Tooltip>{authorLike.release.title}</Tooltip>}
						spanClassName='text-white relative'
						centered={true}
					>
						<img
							loading='lazy'
							decoding='async'
							alt={authorLike.release.title}
							src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
								authorLike.release.img === ''
									? import.meta.env.VITE_DEFAULT_COVER
									: authorLike.release.img
							}`}
							className='size-11.5 rounded-md object-cover aspect-square'
						/>
					</TooltipSpan>
				</Link>
			</div>
		</div>
	)
}

export default AuthorLikeCardHeader
