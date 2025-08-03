import { FC } from 'react'
import NextSvg from '../svg/Next-svg'
import PrevSvg from '../svg/Prev-svg'

interface IProps {
	isNext: boolean
	handlePrev: () => void
	handleNext: () => void
	disabled?: boolean
}

const CarouselNavButton: FC<IProps> = ({
	isNext,
	handleNext,
	handlePrev,
	disabled = false,
}) => {
	const handleClick = () => {
		if (!disabled) {
			return isNext ? handleNext() : handlePrev()
		}
	}

	return (
		<button
			onClick={handleClick}
			className={`${
				disabled ? 'opacity-50 pointer-events-none' : ''
			} relative rounded-full h-10 w-10 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors`}
		>
			{isNext ? <NextSvg /> : <PrevSvg />}
		</button>
	)
}

export default CarouselNavButton
