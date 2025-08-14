import { FC } from 'react'
import { IRelease } from '../../../../../models/release/release'

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
				<div
					className={`rounded-full size-14 lg:size-18 border flex items-center justify-center overflow-hidden ${
						release.hasAuthorComments || release.hasAuthorLikes
							? 'border-red-500'
							: 'border-blue-250'
					}`}
				>
					<img
						alt={release.title}
						loading='lazy'
						decoding='async'
						src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
							release.img === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: release.img
						}`}
						className={`object-cover rounded-full size-12 lg:size-16 hover:scale-110 transition-all duration-300 `}
					/>
				</div>

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
