import { FC } from 'react'
import { createPortal } from 'react-dom'
import { CloseSvgIcon } from '../../../../../components/notifications/NotificationSvgIcons'
import NextSvg from '../../../../../components/svg/Next-svg'
import PrevSvg from '../../../../../components/svg/Prev-svg'
import { useStore } from '../../../../../hooks/use-store'
import MostReviewedSwiperButton from './Most-reviewed-swiper-button'
import MostReviewedCarouselCard from './Most-reviewed-swiper-card'

interface IProps {
	show: boolean
	setShow: (val: boolean) => void
	index: number
	setIndex: (val: number) => void
}

const MostReviewedSwiper: FC<IProps> = ({ show, setShow, index, setIndex }) => {
	const { mainPageStore } = useStore()

	return createPortal(
		<div
			className={`fixed inset-0 z-[1000000] backdrop-blur-3xl overflow-y-auto h-[100vh] flex items-center justify-center transition-all duration-200 gap-3 ${
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
				<CloseSvgIcon
					classname={
						'absolute right-1 top-2.5 lg:right-5 lg:top-5 size-8 lg:size-10 bg-zinc-950 rounded-full flex items-center justify-center border border-white/10 cursor-pointer p-2'
					}
				/>
			</span>

			{index > 0 && (
				<div
					key={`prev-${index}`}
					className='hidden absolute left-[calc(50%-620px)] transform -translate-y-1/2 top-1/2 blur-xs h-full xl:flex items-center scale-90 slide-in-top'
				>
					<MostReviewedCarouselCard
						release={mainPageStore.mostReviewedReleases[index - 1]}
						index={index - 1}
					/>
				</div>
			)}

			<MostReviewedSwiperButton
				disabled={index === 0}
				onClick={() => setIndex(index - 1)}
			>
				<PrevSvg className={''} />
			</MostReviewedSwiperButton>

			<div
				key={index}
				className='relative slide-in-top h-full flex items-center justify-center'
			>
				<MostReviewedCarouselCard
					release={mainPageStore.mostReviewedReleases[index]}
					index={index}
				/>
			</div>

			<MostReviewedSwiperButton
				disabled={index === mainPageStore.mostReviewedReleases.length - 1}
				onClick={() => setIndex(index + 1)}
			>
				<NextSvg className={''} />
			</MostReviewedSwiperButton>

			{index + 1 < mainPageStore.mostReviewedReleases.length && (
				<div
					key={`next-${index}`}
					className='hidden absolute right-[calc(50%-620px)] transform -translate-y-1/2 top-1/2 blur-xs h-full xl:flex items-center scale-90 slide-in-top'
				>
					<MostReviewedCarouselCard
						release={mainPageStore.mostReviewedReleases[index + 1]}
						index={index + 1}
					/>
				</div>
			)}
		</div>,
		document.body
	)
}

export default MostReviewedSwiper
