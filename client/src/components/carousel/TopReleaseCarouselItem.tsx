import { FC } from 'react'

interface ITopReleaseCarouselItemProps {
	id: string
	img: string
	title: string
}

const TopReleaseCarouselItem: FC<ITopReleaseCarouselItemProps> = ({
	img,
	title,
}) => {
	return (
		<div className='embla__slide flex-[0_0_64px] mr-1 lg:mr-7'>
			<button className='flex flex-col items-center space-y-1.5 lg:space-y-2.5 cursor-pointer select-none w-13 lg:w-17'>
				<img
					alt='test'
					loading='lazy'
					decoding='async'
					src={img}
					className='rounded-full w-12 h-12 lg:w-16 lg:h-16 border-2 border-blue-250 hover:scale-110 transition-all duration-500'
				/>
				<div className='w-full'>
					<p className='text-center text-xs text-ellipsis max-w-full whitespace-nowrap overflow-hidden'>
						{title}
					</p>
				</div>
			</button>
		</div>
	)
}

export default TopReleaseCarouselItem
