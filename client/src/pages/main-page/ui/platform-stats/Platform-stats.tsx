import PlatformStatsLeaderboard from './platform-stats-leaderboard/Platform-stats-leaderboard'

const PlatformStats = () => {
	return (
		<section className='grid lg:grid-cols-2 gap-6 lg:gap-15 max-w-[1024px] w-full mx-auto'>
			<PlatformStatsLeaderboard />
		</section>
	)
}

export default PlatformStats
