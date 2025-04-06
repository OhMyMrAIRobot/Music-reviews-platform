import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import LastReleasesCarousel, {
	CarouselRef,
} from '../carousel/lastReleases/LastReleasesCarousel'
import { NextSvgIcon, PrevSvgIcon } from '../svg/ReleaseSvgIcons'

const LastReleasesContainer = observer(() => {
	const carouselRef = useRef<CarouselRef>(null)

	const handlePrev = () => {
		carouselRef.current?.scrollPrev()
	}

	const handleNext = () => {
		carouselRef.current?.scrollNext()
	}

	return (
		<section className='2xl:container w-full flex flex-col items-center'>
			<div className='flex w-full sm:items-center items-end justify-between'>
				<h3 className='text-lg lg:text-2xl font-semibold'>
					Добавленные релизы
				</h3>
				<div className='flex flex-col-reverse sm:flex-row sm:gap-5 gap-2 select-none items-center'>
					<button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full px-4 py-2 bg-secondary cursor-pointer'>
						Все релизы
					</button>
					<div className='flex gap-3 items-center'>
						<button
							onClick={handlePrev}
							className='relative rounded-full h-10 w-10 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors'
						>
							<PrevSvgIcon />
						</button>
						<button
							onClick={handleNext}
							className='relative rounded-full h-10 w-10 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors'
						>
							<NextSvgIcon />
						</button>
					</div>
				</div>
			</div>

			<LastReleasesCarousel ref={carouselRef} />
		</section>
	)
})

export default LastReleasesContainer
