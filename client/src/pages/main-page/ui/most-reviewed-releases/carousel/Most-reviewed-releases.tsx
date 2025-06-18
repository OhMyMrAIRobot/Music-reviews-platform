import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import MostReviewedSwiper from '../swiper/Most-reviewed-swiper'
import MostReviewedCarousel from './Most-reviewed-carousel'

const MostReviewedReleases = observer(() => {
	const [index, setIndex] = useState<number>(0)
	const [show, setShow] = useState<boolean>(false)

	return (
		<section className='2xl:container flex flex-col items-center'>
			<div className='flex justify-center items-center mb-2.5 lg:mb-5'>
				<h3 className='text-xs lg:text-sm font-semibold text-center bg-gradient-to-br from-zinc-700 border border-zinc-800 rounded-full px-5 py-1.5 select-none'>
					ТОП-15 по количеству оценок и рецензий за сутки
				</h3>
			</div>
			<MostReviewedSwiper
				show={show}
				setShow={setShow}
				index={index}
				setIndex={setIndex}
			/>
			<MostReviewedCarousel setShow={setShow} setIndex={setIndex} />
		</section>
	)
})

export default MostReviewedReleases
