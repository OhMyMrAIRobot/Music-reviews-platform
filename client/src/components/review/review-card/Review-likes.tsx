import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { IAuthorFavMedia } from '../../../models/release/release-media/user-fav-media/author-fav-media'
import { IAuthorFavReview } from '../../../models/review/user-fav-review/author-fav-review'
import Tooltip from '../../tooltip/Tooltip'
import TooltipSpan from '../../tooltip/Tooltip-span'
import Loader from '../../utils/Loader'

interface IProps {
	toggling: boolean
	isLiked: boolean
	likesCount: number
	toggleFavReview: () => void
	authorLikes: IAuthorFavReview[] | IAuthorFavMedia[]
}

const ReviewLikes: FC<IProps> = ({
	toggling,
	likesCount,
	isLiked,
	toggleFavReview,
	authorLikes,
}) => {
	const { navigatoToProfile } = useNavigationPath()

	return (
		<div className='flex items-center'>
			<button
				disabled={toggling}
				onClick={toggleFavReview}
				className={`flex items-center justify-center gap-1 px-4 h-8 lg:h-10 border rounded-full cursor-pointer group select-none ${
					isLiked ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/5'
				} ${toggling ? 'opacity-50' : 'opacity-100'}`}
			>
				{toggling ? (
					<div className='size-5 lg:size-7 flex items-center justify-center'>
						<Loader className={'size-3 lg:size-5'} />
					</div>
				) : (
					<img
						loading='lazy'
						decoding='async'
						alt={'heart'}
						src={`${import.meta.env.VITE_SERVER_URL}/public/assets/heart.png`}
						className={`w-5 lg:w-7 transition-opacity duration-300 ${
							isLiked
								? 'opacity-100'
								: 'opacity-50 hover:opacity-100 group-hover:opacity-100'
						}`}
					/>
				)}

				{likesCount > 0 && (
					<span className='font-bold lg:text-lg'>{likesCount}</span>
				)}
			</button>

			{authorLikes.map(like => (
				<TooltipSpan
					key={like.nickname}
					tooltip={<Tooltip>{like.nickname}</Tooltip>}
					spanClassName='text-white cursor-pointer flex flex-wrap -space-x-2 relative ml-3.5'
					centered={true}
				>
					<Link to={navigatoToProfile(like.userId)} className='relative'>
						<img
							alt={'author-like'}
							src={`${
								import.meta.env.VITE_SERVER_URL
							}/public/assets/author-like.png`}
							className='size-6 absolute -right-1.5 -bottom-1.5'
						/>

						<img
							loading='lazy'
							decoding='async'
							src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
								like.avatar === ''
									? import.meta.env.VITE_DEFAULT_AVATAR
									: like.avatar
							}`}
							className='size-9 rounded-full border-2 border-white/10 object-cover'
						/>
					</Link>
				</TooltipSpan>
			))}
		</div>
	)
}

export default ReviewLikes
