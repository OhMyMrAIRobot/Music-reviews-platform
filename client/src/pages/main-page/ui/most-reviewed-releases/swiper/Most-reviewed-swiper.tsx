import { FC, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Keyboard } from 'swiper/modules'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import CloseSvg from '../../../../../components/svg/Close-svg'
import NextSvg from '../../../../../components/svg/Next-svg'
import PrevSvg from '../../../../../components/svg/Prev-svg'
import { IRelease } from '../../../../../models/release/release'
import MostReviewedSwiperCard from './Most-reviewed-swiper-card'

interface IProps {
	items: IRelease[]
	show: boolean
	setShow: (val: boolean) => void
	index: number
	setIndex: (val: number) => void
}

const MostReviewedSwiper: FC<IProps> = ({
	items,
	show,
	setShow,
	index,
	setIndex,
}) => {
	const swiperRef = useRef<SwiperRef>(null)

	useLayoutEffect(() => {
		if (swiperRef.current?.swiper && show) {
			swiperRef.current.swiper.slideTo(index, 0)
		}
	}, [index, show])

	const handlePrev = () => {
		if (swiperRef.current?.swiper && index > 0) {
			swiperRef.current.swiper.slidePrev()
		}
	}

	const handleNext = () => {
		if (swiperRef.current?.swiper && index < items.length - 1) {
			swiperRef.current.swiper.slideNext()
		}
	}

	useEffect(() => {
		if (show) {
			document.body.style.overflow = 'hidden'
			document.body.style.height = '100vh'
		} else {
			document.body.style.overflow = 'unset'
			document.body.style.height = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
			document.body.style.height = 'unset'
		}
	}, [show])

	return createPortal(
		<div
			className={`fixed inset-0 z-[1000000] backdrop-blur-3xl overflow-hidden h-[100vh] flex items-center justify-center transition-all duration-200 ${
				show
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}`}
		>
			<span
				onClick={() => {
					setShow(false)
					setIndex(0)
				}}
			>
				<CloseSvg
					className={
						'absolute right-1 top-2.5 lg:right-5 lg:top-5 size-8 lg:size-10 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 cursor-pointer p-2 z-50'
					}
				/>
			</span>

			<button
				onClick={handlePrev}
				disabled={index === 0}
				className='absolute left-0 xl:left-[33%] z-10 transform -translate-y-1/2 top-1/2 bg-zinc-950 rounded-full size-12 flex items-center justify-center border border-white/10 cursor-pointer p-2 disabled:opacity-30 disabled:cursor-not-allowed'
			>
				<PrevSvg className='size-6' />
			</button>

			<div className='w-full max-w-7xl h-[90vh] flex items-center justify-center'>
				<Swiper
					ref={swiperRef}
					modules={[Keyboard]}
					navigation
					keyboard
					initialSlide={index}
					spaceBetween={80}
					slidesPerView={1}
					centeredSlides={true}
					onSlideChange={swiper => setIndex(swiper.activeIndex)}
					breakpoints={{
						1280: {
							slidesPerView: 3,
							centeredSlides: true,
						},
					}}
					speed={500}
					className='w-full h-[90%]'
				>
					{items.map((release, i) => (
						<SwiperSlide
							key={i}
							className='h-[90%] flex items-center justify-center'
						>
							<div
								className={`h-full transition-all duration-500 xl:w-full w-full max-w-[350px] xl:max-w-full mx-auto ${
									i === index ? 'scale-100' : 'scale-90 blur-xs'
								}
              `}
							>
								<MostReviewedSwiperCard release={release} index={i} />
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<button
				onClick={handleNext}
				disabled={index === items.length - 1}
				className='absolute right-0 xl:right-[33%] z-10 transform -translate-y-1/2 top-1/2 bg-zinc-950 rounded-full size-12 flex items-center justify-center border border-white/10 cursor-pointer p-2 disabled:opacity-30 disabled:cursor-not-allowed'
			>
				<NextSvg className='size-6' />
			</button>
		</div>,
		document.body
	)
}

export default MostReviewedSwiper
