import { FC } from 'react'
import NextSvg from '../svg/Next-svg'
import PrevSvg from '../svg/Prev-svg'

interface IProps {
	isNext: boolean
	handlePrev: () => void
	handleNext: () => void
}

const CarouselNavButton: FC<IProps> = ({ isNext, handleNext, handlePrev }) => {
	return (
		<button
			onClick={isNext ? handleNext : handlePrev}
			className='relative rounded-full h-10 w-10 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors'
		>
			{isNext ? <NextSvg className={''} /> : <PrevSvg className={''} />}
		</button>
	)
}

export default CarouselNavButton
