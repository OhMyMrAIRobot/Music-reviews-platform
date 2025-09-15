import { useQuery } from '@tanstack/react-query'
import { LeaderboardAPI } from '../../api/leaderboard-api'
import { ILeaderboardItem } from '../../models/leaderboard/leaderboard-item'
import { leaderboardKeys } from '../../query-keys/leaderboard-keys'
import LeaderboardHeader from './ui/Leaderboard-header'
import LeaderboardItem from './ui/Leaderboard-item'
import LeaderboardTitle from './ui/Leaderboard-title'

const queryKey = leaderboardKeys.list({ limit: null, offset: null })
const queryFn = () => LeaderboardAPI.fetchLeaderboard(null, null)

const LeaderboardPage = () => {
	const { data, isPending } = useQuery<ILeaderboardItem[]>({
		queryKey,
		queryFn,
		staleTime: 1000 * 60 * 5,
	})

	const items = data ?? []

	return (
		<div className='max-w-[1250px] mx-auto'>
			<LeaderboardTitle />

			<div className='mt-5 flex flex-col gap-y-3.5'>
				<LeaderboardHeader />

				{isPending
					? Array.from({ length: 15 }).map((_, idx) => (
							<LeaderboardItem
								key={`leaderboard-skeleton-${idx}`}
								isLoading={isPending}
							/>
					  ))
					: items.map(item => (
							<LeaderboardItem
								key={item.userId}
								item={item}
								isLoading={isPending}
							/>
					  ))}

				{items.length === 0 && !isPending && (
					<p className='text-center text-2xl font-semibold mt-10 w-full'>
						Таблица лидеров пуста!
					</p>
				)}
			</div>
		</div>
	)
}

export default LeaderboardPage
