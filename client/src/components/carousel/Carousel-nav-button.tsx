import { FC } from 'react'
import { NextSvgIcon, PrevSvgIcon } from '../svg/ReleaseSvgIcons'

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
			{isNext ? <NextSvgIcon /> : <PrevSvgIcon />}
		</button>
	)
}

export default CarouselNavButton
