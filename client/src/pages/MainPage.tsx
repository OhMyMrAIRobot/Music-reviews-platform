import { observer } from 'mobx-react-lite'
import LastReleasesContainer from '../components/container/LastReleasesContainer'
import TopReleasesContainer from '../components/container/TopReleasesContainer'

const MainPage = observer(() => {
	return (
		<>
			<div className='size-full bg-primary h-[1000px] xl:px-5 flex flex-col gap-y-10'>
				<TopReleasesContainer />
				<LastReleasesContainer />
			</div>
		</>
	)
})

export default MainPage
