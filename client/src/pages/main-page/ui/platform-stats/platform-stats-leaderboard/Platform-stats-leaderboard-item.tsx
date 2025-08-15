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
	position: number
	item?: ILeaderboardItem
}

const PlatformStatsLeaderboardItem: FC<IProps> = ({
	isLoading,
	item,
	position,
}) => {
	const { navigatoToProfile } = useNavigationPath()

	const level = getUserLevel(item?.points ?? 0)

	return isLoading || !item ? (
		<SkeletonLoader className='w-full rounded-xl h-[48px]' />
	) : (
		<div className='bg-zinc-900 border border-white/10 flex p-[3px] rounded-xl items-stretch justify-between'>
			<div className='flex items-center gap-2'>
				<div className='bg-zinc-950 flex items-center justify-center size-[40px] rounded-lg '>
					{position}
				</div>
				<div className='flex gap-x-3 items-center relative'>
					<Link
						to={navigatoToProfile(item.userId)}
						className='inset-0 absolute z-100'
					/>
					<div className='relative'>
						<img
							loading='lazy'
							decoding='async'
							alt={item.nickname}
							className='shrink-0 size-[30px] lg:size-[40px] border border-white/10 rounded-full object-cover'
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
									className='size-5 lg:size-6'
									src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
										getLevelConfig(level).image
									}`}
								/>
							</div>
						)}
					</div>
					<div className='w-[100px] lg:w-[150px]'>
						<span className='text-ellipsis max-w-full whitespace-nowrap overflow-hidden text-sm font-semibold'>
							{item.nickname}
						</span>
					</div>
				</div>
			</div>

			<div className='flex items-stretch gap-x-2'>
				<div className='flex items-center ml-auto h-full space-x-3 min-w-[80px] px-2 text-xs justify-center bg-zinc-950 border rounded-xl border-white/10'>
					<div className='flex items-center gap-x-1'>
						<LogoSmallSvg className='w-[25px] h-4' />
						<span>{formatNumber(item.points)}</span>
					</div>
				</div>

				<div className='flex items-center h-full space-x-3 min-w-[60px] px-2 text-xs justify-center bg-zinc-950 border border-white/10 rounded-xl'>
					<div className='flex items-center gap-x-1'>
						<AuthorLikeColorSvg className='size-5' />
						<span>{item.receivedLikes}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PlatformStatsLeaderboardItem
