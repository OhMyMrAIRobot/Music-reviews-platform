import { observer } from 'mobx-react-lite'
import TopReleaseCarousel from '../carousel/topReleaseCarousel'

const TopReleasesContainer = observer(() => {
	return (
		<section className='2xl:container flex flex-col items-center'>
			<div className='flex justify-center items-center mb-2.5 lg:mb-5'>
				<h3 className='text-xs lg:text-sm font-semibold text-center bg-gradient-to-br from-zinc-700 border border-zinc-800 rounded-full px-5 py-1.5 select-none'>
					ТОП-15 по количеству оценок и рецензий за сутки
				</h3>
			</div>
			<TopReleaseCarousel />
		</section>
	)
})

export default TopReleasesContainer
