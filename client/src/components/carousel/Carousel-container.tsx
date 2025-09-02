import { FC, ReactNode } from 'react'
import { Link } from 'react-router'
import CarouselNavButton from './Carousel-nav-button'

interface IProps {
	title: ReactNode
	buttonTitle: string
	showButton: boolean
	href: string
	handlePrev: () => void
	handleNext: () => void
	canScrollNext: boolean
	canScrollPrev: boolean
	carousel: ReactNode
}

const CarouselContainer: FC<IProps> = ({
	title,
	buttonTitle,
	showButton,
	href,
	handlePrev,
	handleNext,
	canScrollNext,
	canScrollPrev,
	carousel,
}) => {
	return (
		<section className='2xl:container w-full flex flex-col items-center gap-y-2'>
			<div className='flex w-full sm:items-center items-end justify-between'>
				<h3 className='text-lg lg:text-2xl font-semibold'>{title}</h3>
				<div className='flex flex-col-reverse sm:flex-row sm:gap-5 gap-2 items-end'>
					{showButton && (
						<Link
							to={href}
							className='inline-flex items-center justify-center text-center text-sm font-bold rounded-full px-4 h-10 bg-zinc-800 hover:bg-zinc-800/80 transition-all duration-200'
						>
							{buttonTitle}
						</Link>
					)}
					<div className='flex gap-3 items-center'>
						<CarouselNavButton
							isNext={false}
							handlePrev={handlePrev}
							handleNext={handleNext}
							disabled={!canScrollPrev}
						/>
						<CarouselNavButton
							isNext={true}
							handlePrev={handlePrev}
							handleNext={handleNext}
							disabled={!canScrollNext}
						/>
					</div>
				</div>
			</div>
			{carousel}
		</section>
	)
}

export default CarouselContainer
