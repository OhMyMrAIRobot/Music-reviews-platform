import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import AuthorCommentSvg from '../../../../../components/author-comment/svg/Author-comment-svg'
import AuthorLikeSvg from '../../../../../components/registered-author/svg/Author-like-svg'
import RegisteredAuthorSvg from '../../../../../components/registered-author/svg/Registered-author-svg'
import AlbumSvg from '../../../../../components/release/svg/Album-svg'
import SingleSvg from '../../../../../components/release/svg/Single-svg'
import NoTextReviewSvg from '../../../../../components/review/svg/No-text-review-svg'
import TextReviewSvg from '../../../../../components/review/svg/Text-review-svg'
import MediaPlayerSvg from '../../../../../components/svg/Media-player-svg'
import UserSvg from '../../../../../components/svg/User-svg'
import { useLoading } from '../../../../../hooks/use-loading'
import useNavigationPath from '../../../../../hooks/use-navigation-path'
import { useStore } from '../../../../../hooks/use-store'
import PlatformStatisticsRow from './Platform-statistics-row'

const PlatformStatistics = observer(() => {
	const { mainPageStore } = useStore()

	const {
		navigateToRegisteredAuthors,
		navigateToAuthorLikes,
		navigateToAuthorComments,
		navigateToReleases,
		navigateToReviews,
		navigateToMediaReviews,
	} = useNavigationPath()

	const { execute: fetchStats, isLoading: isStatsLoading } = useLoading(
		mainPageStore.fetchPlatformStats
	)

	useEffect(() => {
		fetchStats()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const stats = mainPageStore.platformStats

	return (
		<div>
			<div className='flex flex-wrap items-center gap-x-5 gap-y-2 mb-1.5 lg:mb-3 mt-1.5'>
				<h2 className='text-lg xl:text-xl font-semibold '>Статистика</h2>
				<div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-zinc-900 text-white hover:bg-zinc-900'>
					Все время
				</div>
			</div>

			<div className='grid gap-0.5 lg:gap-1.5 grid-cols-1'>
				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Всего пользователей'}
					value={stats?.totalUsers ?? 0}
					svg={<UserSvg className='size-5' />}
				/>

				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Зарегистрированных авторов'}
					value={stats?.registeredAuthors ?? 0}
					svg={<RegisteredAuthorSvg className='size-5' />}
					link={navigateToRegisteredAuthors}
				/>

				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Авторских лайков'}
					value={stats?.authorLikes ?? 0}
					svg={<AuthorLikeSvg className='size-5' />}
					link={navigateToAuthorLikes}
				/>

				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Авторских комментариев'}
					value={stats?.authorComments ?? 0}
					svg={<AuthorCommentSvg className='size-5' />}
					link={navigateToAuthorComments}
				/>
			</div>

			<div
				data-orientation='horizontal'
				role='none'
				className='shrink-0 h-[1px] w-full border border-white/10 border-dashed my-3 bg-transparent'
			/>

			<div className='grid gap-0.5 lg:gap-1.5 grid-cols-1'>
				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Всего треков'}
					value={stats?.totalTracks ?? 0}
					svg={<SingleSvg className='size-5' />}
					link={navigateToReleases}
				/>

				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Всего альбомов'}
					value={stats?.totalAlbums ?? 0}
					svg={<AlbumSvg className='size-5' />}
					link={navigateToReleases}
				/>
			</div>

			<div
				data-orientation='horizontal'
				role='none'
				className='shrink-0 h-[1px] w-full border border-white/10 border-dashed my-3 bg-transparent'
			/>

			<div className='grid gap-0.5 lg:gap-1.5 grid-cols-1'>
				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Рецензий'}
					value={stats?.reviews ?? 0}
					svg={<TextReviewSvg className='size-5' />}
					link={navigateToReviews}
				/>

				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Оценков без рецензий'}
					value={stats?.withoutTextRatings ?? 0}
					svg={<NoTextReviewSvg className='size-5' />}
				/>

				<PlatformStatisticsRow
					isLoading={isStatsLoading}
					title={'Медиарецензий'}
					value={stats?.mediaReviews ?? 0}
					svg={<MediaPlayerSvg className='size-5' />}
					link={navigateToMediaReviews}
				/>
			</div>
		</div>
	)
})

export default PlatformStatistics
