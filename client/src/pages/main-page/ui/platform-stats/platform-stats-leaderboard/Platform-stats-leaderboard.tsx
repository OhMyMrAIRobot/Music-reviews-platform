import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { useLoading } from '../../../../../hooks/use-loading'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { useStore } from '../../../../../hooks/use-store'
import PlatformStatsLeaderboardItem from './Platform-stats-leaderboard-item'
import PlatformStatsLeaderboardLeaderItem from './Platform-stats-leaderboard-leader-item'

const PlatformStatsLeaderboard = observer(() => {
	const { mainPageStore } = useStore()

	const { navigateToLeaderboard } = useNavigationPath()

	const { execute: fetchLeaderboard, isLoading: isLeaderboardLoading } =
		useLoading(mainPageStore.fetchLeaderboard)

	useEffect(() => {
		fetchLeaderboard()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const items = mainPageStore.leaderboard

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
					isLoading={isLeaderboardLoading}
					position={1}
					className='order-2 pt-6 pb-3'
					item={items.length > 0 ? items[0] : undefined}
				/>
				<PlatformStatsLeaderboardLeaderItem
					isLoading={isLeaderboardLoading}
					position={2}
					className='order-1 pt-3'
					item={items.length > 1 ? items[1] : undefined}
				/>
				<PlatformStatsLeaderboardLeaderItem
					isLoading={isLeaderboardLoading}
					position={3}
					className='order-3 pt-3'
					item={items.length > 2 ? items[2] : undefined}
				/>
			</div>

			<div className='space-y-1.5 flex flex-col mt-2 lg:mt-4'>
				{isLeaderboardLoading
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
})

export default PlatformStatsLeaderboard
