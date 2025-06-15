import { observer } from 'mobx-react-lite'
import LastReleases from './ui/last-releases/Last-releases'
import LastReviews from './ui/last-reviews/Last-reviews'
import MostReviewedReleases from './ui/most-reviewed-releases/carousel/Most-reviewed-releases'

const MainPage = observer(() => {
	return (
		<>
			<div className='size-full xl:px-5 flex flex-col gap-y-15'>
				<MostReviewedReleases />
				<LastReleases />
				<LastReviews />
			</div>
		</>
	)
})

export default MainPage
