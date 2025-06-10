import { observer } from 'mobx-react-lite'
import LastReviewsContainer from '../../components/container/LastReviewsContainer'
import LastReleases from './ui/last-releases/Last-releases'
import MostReviewedReleases from './ui/most-reviewed-releases/carousel/Most-reviewed-releases'

const MainPage = observer(() => {
	return (
		<>
			<div className='size-full bg-primary xl:px-5 flex flex-col gap-y-15'>
				<MostReviewedReleases />
				<LastReleases />
				<LastReviewsContainer />
			</div>
		</>
	)
})

export default MainPage
