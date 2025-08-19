import { FC, useRef } from 'react'
import { Link } from 'react-router'
import LogoFullSvg from '../../../../components/svg/Logo-full-svg'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { NominationTypesEnum } from '../../../../models/nomination/nomination-type/nomination-type-enum'
import { INominationWinnerParticipationItem } from '../../../../models/nomination/nomination-winner-participation/nomination-winner-participation-item'
import { MonthEnum, MonthEnumType } from '../../../../types/month-enum-type'

interface IProps {
	item?: INominationWinnerParticipationItem
	isLoading: boolean
}

const AuthorDetailsNominationsCarouselItem: FC<IProps> = ({
	item,
	isLoading,
}) => {
	const { navigateToReleaseDetails } = useNavigationPath()
	const cardRef = useRef<HTMLDivElement>(null)
	const glareRef = useRef<HTMLDivElement>(null)

	const { VITE_SERVER_URL, VITE_DEFAULT_AVATAR, VITE_DEFAULT_COVER } =
		import.meta.env

	const imgPath = item
		? `${VITE_SERVER_URL}/public/${
				item.entityKind === 'author'
					? `authors/avatars/${item.author?.avatarImg || VITE_DEFAULT_AVATAR}`
					: `releases/${item.release?.img || VITE_DEFAULT_COVER}`
		  }`
		: ''

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!cardRef.current || !glareRef.current) return

		const card = cardRef.current
		const glare = glareRef.current
		const rect = card.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		const centerX = rect.width / 2
		const centerY = rect.height / 2

		const rotateY = ((x - centerX) / centerX) * 10
		const rotateX = ((centerY - y) / centerY) * 10

		card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg) scale3d(1.02, 1.02, 1.02)`

		const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)

		glare.style.opacity = '0.1'
		glare.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`
	}

	const handleMouseLeave = () => {
		if (!cardRef.current || !glareRef.current) return

		cardRef.current.style.transform =
			'perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

		glareRef.current.style.opacity = '0'
		glareRef.current.style.transform = 'rotate(0deg) translate(-50%, -50%)'
	}

	return isLoading || !item ? (
		<SkeletonLoader className={'w-full h-140 rounded-[26px]'} />
	) : (
		<Link
			to={
				item.entityKind === 'release' && item.release
					? navigateToReleaseDetails(item.release?.id)
					: '#'
			}
			className='group relative block size-full rounded-[26px]'
		>
			<img
				loading='lazy'
				decoding='async'
				className='blur-[45px] opacity-30 absolute -z-10 bottom-[50px] right-0 max-lg:hidden w-[90%] h-[85%]'
				src={imgPath}
			/>
			<div
				ref={cardRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={{
					willChange: 'transform',
					transition: 'transform 1900ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
					transform:
						'perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
				}}
				className='bg-white/5 rounded-[26px] h-full relative flex flex-col justify-start border-2 border-[rgba(255,255,255,0.06)] max-lg:transform-none max-lg:rotate-none max-lg:scale-100 overflow-hidden'
			>
				<div className='relative transition-all overflow-hidden pt-[13px] px-[13px] lg:pt-[27px] lg:px-[27px] rounded-[21px] lg:group-hover:rounded-[25px] duration-300 ease'>
					<div className='rounded-[15px] transition-all lg:group-hover:scale-[114%] lg:group-hover:translate-y-[-25px] duration-300'>
						<img
							loading='lazy'
							decoding='async'
							src={imgPath}
							className='rounded-[17px] transition-all duration-300 lg:group-hover:rounded-[25px] w-full'
						/>
					</div>
				</div>

				<div className='px-[13px] lg:px-[25px] pt-3 pb-2.5 lg:pt-5 lg:pb-5'>
					<div className='flex flex-col items-start justify-start'>
						<span className='text-sm lg:text-[20px] font-semibold tracking-tighter leading-[100%] gap-y-1'>
							{item.entityKind === 'author'
								? item.author?.name
								: item.release?.title}
						</span>
						{item.entityKind === 'release' && (
							<span className='text-xs lg:text-base text-white opacity-40 font-medium'>
								{item.nominationType === NominationTypesEnum.COVER_OF_MONTH
									? item.release?.designers.join(', ')
									: item.release?.artists.join(', ')}
							</span>
						)}
					</div>

					<div className='uppercase text-[13px] lg:text-lg border-t border-[rgba(255,255,255,0.1)] mt-3 shrink-0 flex items-center justify-between gap-5 pt-3 lg:pt-5 text-left'>
						<div>
							<div className='text-[10px] lg:text-sm leading-[100%] lg:mb-1 font-semibold'>
								{item.nominationType}
							</div>
							<div className='text-[10px] lg:text-sm opacity-40 font-semibold'>
								{MonthEnum[item.month as MonthEnumType]} {item.year}
							</div>
						</div>

						<div className='max-w-[80px] lg:max-w-[115px] opacity-20'>
							<LogoFullSvg className='w-full' />
						</div>
					</div>
				</div>

				<div
					className='glare-wrapper'
					style={{
						position: 'absolute',
						top: '0px',
						left: '0px',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
						borderRadius: '0px',
						maskImage: '-webkit-radial-gradient(center, white, black)',
						pointerEvents: 'none',
					}}
				>
					<div
						ref={glareRef}
						className='glare'
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transformOrigin: '0% 0%',
							pointerEvents: 'none',
							width: '676.036px',
							height: '676.036px',
							transform: 'rotate(0deg) translate(-50%, -50%)',
							opacity: 0,
							background:
								'linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)',
							transition: 'opacity 1900ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
						}}
					/>
				</div>
			</div>
		</Link>
	)
}

export default AuthorDetailsNominationsCarouselItem
