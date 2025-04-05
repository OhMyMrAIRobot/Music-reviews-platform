import { observer } from 'mobx-react-lite'
import TopReleasesContainer from '../components/container/TopReleasesContainer'

const MainPage = observer(() => {
	return (
		<>
			<div className='size-full bg-primary h-[1000px] 2xl:px-5'>
				<TopReleasesContainer />
			</div>
		</>
	)
})

export default MainPage
