import MainPageAlbumValues from './ui/album-values/Main-page-album-values'
import AuthorComments from './ui/author-comments/Author-comments'
import AuthorLikes from './ui/author-likes/Author-likes'
import LastReleases from './ui/last-releases/Last-releases'
import LastReviews from './ui/last-reviews/Last-reviews'
import MostReviewedReleases from './ui/most-reviewed-releases/carousel/Most-reviewed-releases'
import PlatformStats from './ui/platform-stats/Platform-stats'
import ReleaseMediaReviews from './ui/release-media-reviews/Release-media-reviews'

const MainPage = () => {
	return (
		<>
			<div className='size-full xl:px-5 flex flex-col gap-y-4 lg:gap-y-8'>
				<MostReviewedReleases />
				<AuthorLikes />
				<AuthorComments />
				<LastReleases />
				<ReleaseMediaReviews />
				<LastReviews />
				<MainPageAlbumValues />
				<PlatformStats />
			</div>
		</>
	)
}

export default MainPage
