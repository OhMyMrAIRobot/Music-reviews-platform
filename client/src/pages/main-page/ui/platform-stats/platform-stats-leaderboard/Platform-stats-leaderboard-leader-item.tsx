import { FC } from 'react'
import { Link } from 'react-router'
import AuthorLikeColorSvg from '../../../../../components/registered-author/svg/Author-like-color-svg'
import LogoSmallSvg from '../../../../../components/svg/Logo-small-svg'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { ILeaderboardItem } from '../../../../../models/leaderboard/leaderboard-item'
import { formatNumber } from '../../../../../utils/format-number'
import { getLevelConfig, getUserLevel } from '../../../../../utils/user-level'

interface IProps {
	isLoading: boolean
	item?: ILeaderboardItem
	className?: string
	position: number
}

const PlatformStatsLeaderboardLeaderItem: FC<IProps> = ({
	isLoading,
	item,
	className = '',
	position,
}) => {
	const { navigatoToProfile } = useNavigationPath()

	const level = getUserLevel(item?.points ?? 0)

	return isLoading || !item ? (
		<SkeletonLoader className={`rounded-xl ${className} pb-44`} />
	) : (
		<div
			className={`bg-zinc-900 border border-white/10 flex flex-col p-[3px] rounded-xl items-stretch relative ${className}`}
		>
			<div className='w-10/12 h-[40px] top-2 left-1/2 -translate-x-1/2 rounded-full bg-white opacity-30 blur-xl z-[-1] absolute' />
			<div className='h-[1px] w-[93px] top-[-1px] right-1 absolute bg-gradient-to-r from-white/0 via-white/35 to-white/0' />
			<div className='h-[1px] w-[60px] bottom-[-1px] left-2 absolute bg-gradient-to-r from-white/0 via-white/35 to-white/0' />

			<div className='bg-zinc-950 flex items-center justify-center size-[30px] rounded-lg absolute -top-3 border -left-0.5'>
				{position}
			</div>

			<div className='flex flex-col justify-center text-center items-center relative'>
				<Link
					to={navigatoToProfile(item.userId)}
					className='inset-0 absolute z-100'
				/>
				<div className='relative mb-1'>
					<img
						loading='lazy'
						decoding='async'
						alt={item.nickname}
						className='shrink-0 size-[70px] border border-white/10 rounded-full object-cover'
						src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							item.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: item.avatar
						}`}
					/>
					{level && (
						<div className='absolute -bottom-0.5 -right-2'>
							<img
								alt={item.avatar + level}
								loading='lazy'
								decoding='async'
								width='38'
								height='38'
								className='size-10'
								src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
									getLevelConfig(level).image
								}`}
							/>
						</div>
					)}
				</div>
				<div className='w-[70px] lg:w-[110px]'>
					<span className='text-ellipsis max-w-full whitespace-nowrap overflow-hidden text-sm font-semibold'>
						{item.nickname}
					</span>
				</div>
			</div>

			<div className='flex flex-col items-center justify-center p-2 space-y-1.5 min-w-20 text-xs bg-zinc-950 rounded-xl mt-2'>
				<div className='flex items-center space-x-1'>
					<LogoSmallSvg className='w-[25px] h-5' />
					<span>{formatNumber(item.points)}</span>
				</div>
				<div className='flex items-center space-x-1'>
					<AuthorLikeColorSvg className='size-5' />
					<span>{item.receivedAuthorLikes}</span>
				</div>
			</div>
		</div>
	)
}

export default PlatformStatsLeaderboardLeaderItem
