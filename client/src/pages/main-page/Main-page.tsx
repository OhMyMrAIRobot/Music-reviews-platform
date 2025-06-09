import { observer } from 'mobx-react-lite'
import LastReleasesContainer from '../../components/container/LastReleasesContainer'
import LastReviewsContainer from '../../components/container/LastReviewsContainer'
import MostReviewedReleases from './ui/most-reviewed-releases/carousel/Most-reviewed-releases'

const MainPage = observer(() => {
	return (
		<>
			<div className='size-full bg-primary xl:px-5 flex flex-col gap-y-15'>
				<MostReviewedReleases />
				<LastReleasesContainer />
				<LastReviewsContainer />
			</div>
		</>
	)
})

export default MainPage
