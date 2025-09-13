import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { LeaderboardAPI } from '../../../../../api/leaderboard-api'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import PlatformStatsLeaderboardItem from './Platform-stats-leaderboard-item'
import PlatformStatsLeaderboardLeaderItem from './Platform-stats-leaderboard-leader-item'

const LIMIT = 10
const OFFSET = 0

const queryKey = ['leaderboard', { limit: LIMIT, offset: OFFSET }] as const

const queryFn = () => LeaderboardAPI.fetchLeaderboard(LIMIT, OFFSET)

const PlatformStatsLeaderboard = () => {
	const { navigateToLeaderboard } = useNavigationPath()

	const { data: items = [], isPending } = useQuery({
		queryKey,
		queryFn: queryFn,
		staleTime: 1000 * 60 * 15,
	})

	return (
		<div>
			<div className='flex items-center gap-5 w-full'>
				<h2 className='text-base xl:text-xl font-semibold flex items-center gap-2.5'>
					<span>ТОП-10 по баллам сообщества</span>
				</h2>

				<Link
					to={navigateToLeaderboard}
					className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-10 px-4 py-2 rounded-full bg-white/10 hover:bg-white/8 transition-colors duration-200'
				>
					Весь топ
				</Link>
			</div>

			<div className='grid grid-cols-3 gap-1 lg:gap-4 mt-3 items-end'>
				<PlatformStatsLeaderboardLeaderItem
					isLoading={isPending}
					position={1}
					className='order-2 pt-6 pb-3'
					item={items.length > 0 ? items[0] : undefined}
				/>
				<PlatformStatsLeaderboardLeaderItem
					isLoading={isPending}
					position={2}
					className='order-1 pt-3'
					item={items.length > 1 ? items[1] : undefined}
				/>
				<PlatformStatsLeaderboardLeaderItem
					isLoading={isPending}
					position={3}
					className='order-3 pt-3'
					item={items.length > 2 ? items[2] : undefined}
				/>
			</div>

			<div className='space-y-1.5 flex flex-col mt-2 lg:mt-4'>
				{isPending
					? Array.from({ length: 7 }).map((_, idx) => (
							<PlatformStatsLeaderboardItem
								key={`Skeleton-leaderboard-item-${idx}`}
								isLoading={true}
								position={idx + 1}
							/>
					  ))
					: items.map((item, idx) => {
							if (idx < 3) return null
							return (
								<PlatformStatsLeaderboardItem
									key={item.userId}
									isLoading={false}
									item={item}
									position={idx + 1}
								/>
							)
					  })}
			</div>
		</div>
	)
}

export default PlatformStatsLeaderboard
