import { useEffect } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import LeaderboardHeader from './ui/Leaderboard-header'
import LeaderboardItem from './ui/Leaderboard-item'
import LeaderboardTitle from './ui/Leaderboard-title'

const LeaderboardPage = () => {
	const { leaderboardStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		leaderboardStore.fetchLeaderboard
	)

	useEffect(() => {
		fetch()
	}, [fetch])

	return (
		<div className='max-w-[1250px] mx-auto'>
			<LeaderboardTitle />

			<div className='mt-5 flex flex-col gap-y-3.5'>
				<LeaderboardHeader />
				{isLoading
					? Array.from({ length: 15 }).map((_, idx) => (
							<LeaderboardItem
								key={`leaderboard-skeleton-${idx}`}
								isLoading={isLoading}
							/>
					  ))
					: leaderboardStore.items.map(item => (
							<LeaderboardItem
								key={item.userId}
								item={item}
								isLoading={isLoading}
							/>
					  ))}
				{leaderboardStore.items.length === 0 && !isLoading && (
					<p className='text-center text-2xl font-semibold mt-10 w-full'>
						Таблица лидеров пуста!
					</p>
				)}
			</div>
		</div>
	)
}

export default LeaderboardPage
