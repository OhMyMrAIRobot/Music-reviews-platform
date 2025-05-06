import { FC, ReactNode } from 'react'
import { NextSvgIcon, PrevSvgIcon } from '../svg/ReleaseSvgIcons'

interface IProps {
	title: string
	buttonTitle: string
	showButton: boolean
	onButtonClick: () => void
	handlePrev: () => void
	handleNext: () => void
	Carousel: ReactNode
}

const MainCarouselSection: FC<IProps> = ({
	title,
	buttonTitle,
	showButton,
	onButtonClick,
	handlePrev,
	handleNext,
	Carousel,
}) => {
	const NavButton: FC<{ isNext: boolean }> = ({ isNext }) => {
		return (
			<button
				onClick={isNext ? handleNext : handlePrev}
				className='relative rounded-full h-10 w-10 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors'
			>
				{isNext ? <NextSvgIcon /> : <PrevSvgIcon />}
			</button>
		)
	}

	return (
		<section className='2xl:container w-full flex flex-col items-center gap-y-2'>
			<div className='flex w-full sm:items-center items-end justify-between'>
				<h3 className='text-lg lg:text-2xl font-semibold'>{title}</h3>
				<div className='flex flex-col-reverse sm:flex-row sm:gap-5 gap-2 select-none items-center'>
					{showButton && (
						<button
							onClick={onButtonClick}
							className='inline-flex items-center justify-center whitespace-nowrap text-sm font-bold rounded-full px-4 py-2 bg-secondary cursor-pointer'
						>
							{buttonTitle}
						</button>
					)}
					<div className='flex gap-3 items-center'>
						<NavButton isNext={false} />
						<NavButton isNext={true} />
					</div>
				</div>
			</div>
			{Carousel}
		</section>
	)
}

export default MainCarouselSection
