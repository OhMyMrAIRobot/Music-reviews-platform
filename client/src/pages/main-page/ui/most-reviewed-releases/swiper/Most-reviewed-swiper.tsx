import { FC } from 'react'
import { CloseSvgIcon } from '../../../../../components/notifications/NotificationSvgIcons'
import {
	NextSvgIcon,
	PrevSvgIcon,
} from '../../../../../components/svg/ReleaseSvgIcons'
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
	const { releasesStore } = useStore()

	return (
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
						release={releasesStore.topReleases[index - 1]}
						index={index - 1}
					/>
				</div>
			)}

			<MostReviewedSwiperButton
				disabled={index === 0}
				onClick={() => setIndex(index - 1)}
			>
				<PrevSvgIcon />
			</MostReviewedSwiperButton>

			<div
				key={index}
				className='relative slide-in-top h-full flex items-center justify-center'
			>
				<MostReviewedCarouselCard
					release={releasesStore.topReleases[index]}
					index={index}
				/>
			</div>

			<MostReviewedSwiperButton
				disabled={index === releasesStore.topReleases.length - 1}
				onClick={() => setIndex(index + 1)}
			>
				<NextSvgIcon />
			</MostReviewedSwiperButton>

			{index + 1 < releasesStore.topReleases.length && (
				<div
					key={`next-${index}`}
					className='hidden absolute right-[calc(50%-620px)] transform -translate-y-1/2 top-1/2 blur-xs h-full xl:flex items-center scale-90 slide-in-top'
				>
					<MostReviewedCarouselCard
						release={releasesStore.topReleases[index + 1]}
						index={index + 1}
					/>
				</div>
			)}
		</div>
	)
}

export default MostReviewedSwiper
