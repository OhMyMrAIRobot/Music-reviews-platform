import { observer } from 'mobx-react-lite'
import LastReleasesContainer from '../components/container/LastReleasesContainer'
import LastReviewsContainer from '../components/container/LastReviewsContainer'
import TopReleasesContainer from '../components/container/TopReleasesContainer'

const MainPage = observer(() => {
	return (
		<>
			<div className='size-full bg-primary xl:px-5 flex flex-col gap-y-15'>
				<TopReleasesContainer />
				<LastReleasesContainer />
				<LastReviewsContainer />
				<div className='w-20 h-20 border-t-4 border-b-1 border-white rounded-full animate-spin'></div>
			</div>
		</>
	)
})

export default MainPage
