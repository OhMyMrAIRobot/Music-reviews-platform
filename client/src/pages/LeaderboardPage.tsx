import { useEffect } from 'react'
import LBHeader from '../components/leaderboardPage/LBHeader'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const LeaderboardPage = () => {
	const { leaderboardStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		leaderboardStore.fetchLeaderboard
	)

	useEffect(() => {
		fetch().then(result => console.log(result))
	}, [])

	return (
		<div className='max-w-[1300px] mx-auto'>
			<LBHeader />
		</div>
	)
}

export default LeaderboardPage
