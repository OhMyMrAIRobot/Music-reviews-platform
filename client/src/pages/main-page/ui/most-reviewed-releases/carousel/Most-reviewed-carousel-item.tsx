import { FC } from 'react'
import { IRelease } from '../../../../../model/release/release'

interface IProps {
	release: IRelease
	onClick: () => void
}

const MostReviewedCarouselItem: FC<IProps> = ({ release, onClick }) => {
	return (
		<div className='embla__slide flex-[0_0_64px]'>
			<button
				onClick={onClick}
				className='flex flex-col items-center space-y-1.5 lg:space-y-2.5 cursor-pointer select-none w-13 lg:w-17'
			>
				<img
					alt={release.title}
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
						release.img
					}`}
					className='rounded-full w-12 h-12 lg:w-16 lg:h-16 border-2 border-blue-250 hover:scale-110 transition-all duration-500'
				/>
				<div className='w-full'>
					<p className='text-center text-xs text-ellipsis max-w-full whitespace-nowrap overflow-hidden'>
						{release.title}
					</p>
				</div>
			</button>
		</div>
	)
}

export default MostReviewedCarouselItem
