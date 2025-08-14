import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../hooks/use-navigation-path'
import { IAuthorLike } from '../../models/author-likes/author-like'
import SkeletonLoader from '../utils/Skeleton-loader'
import AuthorLikeCardHeader from './Author-like-card-header'

interface IProps {
	isLoading: boolean
	authorLike?: IAuthorLike
}

const AuthorLikeCard: FC<IProps> = ({ isLoading, authorLike }) => {
	const { navigateToReleaseDetails, navigatoToProfile } = useNavigationPath()

	return isLoading || !authorLike ? (
		<SkeletonLoader className={'w-full rounded-2xl h-40'} />
	) : (
		<div className='w-full bg-zinc-900/60 select-none hover:bg-zinc-800/60 transition-all duration-500 p-[5px] border border-white/10 rounded-2xl group relative'>
			<div className='h-[1px] w-[93px] top-0 right-3 absolute bg-gradient-to-r from-white/0 via-white/35 to-white/0' />
			<div className='h-[56px] w-[1px] top-3 right-0 absolute bg-gradient-to-b from-white/0 via-white/25 to-white/0' />
			<div className='absolute h-[130%] w-[130%] bg-gradient-to-tl from-[#FD322B] opacity-20 z-0 to-50% group-hover:scale-[120%] origin-top-right transition-all duration-500 right-0 top-0' />

			<AuthorLikeCardHeader authorLike={authorLike} />

			<Link
				to={navigateToReleaseDetails(authorLike.release.id)}
				className='block text-ellipsis pl-1.5 whitespace-nowrap overflow-hidden text-sm font-bold w-full z-100 relative'
			>
				{authorLike.reviewTitle}
			</Link>

			<div className='p-1.5 mt-4 overflow-hidden flex justify-between rounded-[10px] relative bg-white/8 border border-white/3'>
				<div className='flex items-center relative z-100 gap-2'>
					<Link
						to={navigatoToProfile(authorLike.author.id)}
						className='relative size-7.5 lg:size-9.5 border border-white/10 rounded-full overflow-hidden shrink-0'
					>
						<img
							loading='lazy'
							decoding='async'
							alt={authorLike.author.nickname}
							src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
								authorLike.author.avatar === ''
									? import.meta.env.VITE_DEFAULT_AVATAR
									: authorLike.author.avatar
							}`}
							className='object-cover object-center size-full'
						/>
					</Link>

					<span className='font-semibold leading-4 '>
						{authorLike.author.nickname}
					</span>
				</div>

				<img
					alt={'author-like'}
					src={`${
						import.meta.env.VITE_SERVER_URL
					}/public/assets/author-like.png`}
					className='size-9.5'
				/>

				<div className='absolute h-[80%] w-full bg-gradient-to-bl from-white opacity-10 z-0 to-55% right-0 top-0' />
				<div className='h-[1px] w-[66px] top-0 right-3 absolute bg-gradient-to-r from-white/0 via-white/25 to-white/0' />
				<div className='h-[28px] w-[1px] top-3 right-0 absolute bg-gradient-to-b from-white/0 via-white/25 to-white/0' />
			</div>
		</div>
	)
}

export default AuthorLikeCard
