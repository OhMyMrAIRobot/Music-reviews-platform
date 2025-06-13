import { useEffect } from 'react'
import LBHeader from '../components/leaderboardPage/LBHeader'
import LBItem from '../components/leaderboardPage/LBItem'
import Loader from '../components/loader/loader'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'

const LeaderboardPage = () => {
	const { leaderboardStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		leaderboardStore.fetchLeaderboard
	)

	useEffect(() => {
		fetch()
	}, [])

	return (
		<div className='max-w-[1000px] mx-auto'>
			<LBHeader />
			<div className='mt-5 flex flex-col gap-y-3.5'>
				{isLoading ? (
					<Loader />
				) : (
					leaderboardStore.items.length > 0 &&
					leaderboardStore.items.map(item => (
						<LBItem item={item} key={item.user_id} />
					))
				)}
			</div>
		</div>
	)
}

export default LeaderboardPage
