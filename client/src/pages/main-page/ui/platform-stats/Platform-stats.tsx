import PlatformStatistics from './platform-statistics/Platform-statistics'
import PlatformStatsLeaderboard from './platform-stats-leaderboard/Platform-stats-leaderboard'

const PlatformStats = () => {
	return (
		<section className='grid lg:grid-cols-2 gap-6 lg:gap-15 max-w-[1024px] w-full mx-auto mt-10'>
			<PlatformStatsLeaderboard />
			<PlatformStatistics />
		</section>
	)
}

export default PlatformStats
