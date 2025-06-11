import { FC } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { ILeaderboardItem } from '../../model/leaderboard/leaderboard-item'
import { getLevelConfig, getUserLevel } from '../../utils/user-level'
import { ToolTip } from '../authorsPage/AuthorItem'
import { HeartFilledSvgIcon, HeartSvgIcon } from '../header/HeaderSvgIcons'
import TooltipSpan from '../releasePage/tooltip/Tooltip-span'
import { NoTextReviewSvgIcon, TextReviewSvgIcon } from '../svg/ReleaseSvgIcons'
import { LogoSvg } from './LBSvgIcons'

interface IProps {
	item: ILeaderboardItem
}

const LBItem: FC<IProps> = ({ item }) => {
	const { navigatoToProfile } = useCustomNavigate()

	function formatNumber(points: number) {
		if (points >= 1000000000) {
			const value = points / 1000000000
			return value % 1 === 0 ? value + 'B' : value.toFixed(1) + 'B'
		} else if (points >= 1000000) {
			const value = points / 1000000
			return value % 1 === 0 ? value + 'M' : value.toFixed(1) + 'M'
		} else if (points >= 1000) {
			const value = points / 1000
			return value % 1 === 0 ? value + 'k' : value.toFixed(1) + 'k'
		} else {
			return points.toString()
		}
	}

	const level = getUserLevel(item.points)

	return (
		<div className='bg-zinc-900 border border-white/10 flex max-xl:flex-wrap p-[3px] xl:pr-2 xl:h-[75px] max-xl:gap-y-2 rounded-lg items-stretch relative group xl:hover:bg-zinc-800 transition-all'>
			<div className='absolute max-xl:order-11 size-5 lg:size-8 xl:size-auto max-xl:text-[10px] z-20 max-xl:rounded-full max-xl:-top-2 max-xl:-left-2 bg-zinc-950 xl:relative border border-white/10 flex items-center justify-center aspect-square rounded-lg mr-1'>
				{item.rank}
			</div>

			<div className='h-full relative max-xl:order-3'>
				<div className='flex items-center text-[10px] sm:text-sm h-7 xl:h-full justify-center gap-1.5 xl:flex-col xl:ml-auto min-w-[75px] lg:min-w-[80px] px-2 font-semibold bg-zinc-950 border border-white/10 rounded-lg'>
					<LogoSvg />
					<span className='leading-3 font-bold xl:text-lg'>
						{formatNumber(item.points)}
					</span>
				</div>
			</div>

			<div
				onClick={() => navigatoToProfile(item.user_id)}
				className='flex shrink-0 space-x-4 items-center relative max-xl:w-1/2 max-xl:order-1 cursor-pointer'
			>
				<div className='relative z-20'>
					<span className='relative flex shrink-0 overflow-hidden rounded-full size-[40px] lg:size-[60px] border border-white/10'>
						<img
							alt={item.nickname}
							className='aspect-square h-full w-full'
							src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
								item.avatar
							}`}
						/>
					</span>
					{level && (
						<div className='absolute -bottom-0.5 -right-2'>
							<img
								alt={item.avatar + level}
								loading='lazy'
								width='38'
								height='38'
								decoding='async'
								className='size-6 lg:size-[38px]'
								src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
									getLevelConfig(level).image
								}`}
							/>
						</div>
					)}
				</div>

				<div className='w-[100px] xl:w-[150px] 2xl:w-[200px]'>
					<div className='text-ellipsis max-w-full whitespace-nowrap overflow-hidden text-[12px] sm:text-lg font-semibold'>
						{item.nickname}
					</div>
				</div>
			</div>

			<div className='h-14 sm:h-20 xl:h-auto relative xl:w-[260px] rounded-r-lg xl:rounded-r-2xl overflow-hidden xl:mr-5 max-xl:order-2 max-xl:w-1/2 xl:block shrink-0'>
				<div className='bg-gradient-to-r from-zinc-900 h-full w-full absolute top-0 left-[-1px] z-10'></div>
				<img
					alt='user cover'
					loading='lazy'
					decoding='async'
					data-nimg='fill'
					className='object-cover'
					sizes='100vw'
					src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${item.cover}`}
				/>
			</div>

			<TooltipSpan
				tooltip={
					<ToolTip>
						<div className='font-medium space-y-1'>
							<div className='flex gap-x-2'>
								<TextReviewSvgIcon classname='size-5' />
								Написано рецензий
							</div>
							<div className='flex gap-x-2'>
								<NoTextReviewSvgIcon classname='size-5' />
								Поставлено оценок без рецензий
							</div>
						</div>
					</ToolTip>
				}
				spanClassName={
					'bg-zinc-950 border border-white/10 max-xl:order-5 flex xl:flex-col text-[10px] sm:text-sm justify-center items-center gap-1 lg:gap-2 px-1 xl:px-4 rounded-lg relative mr-1 xl:mr-2 min-w-[100px] xl:ml-auto'
				}
				centered={true}
			>
				{/* <div className='bg-zinc-950 border border-white/10 max-xl:order-5 flex xl:flex-col text-[10px] sm:text-sm justify-center items-center gap-1 lg:gap-2 px-1 xl:px-4 rounded-lg relative mr-1 xl:mr-2 min-w-[100px] xl:ml-auto'> */}
				<div className='flex items-center gap-1.5'>
					<TextReviewSvgIcon classname='size-4 xl:size-6' />
					<span className='font-semibold'>{item.text_count}</span>
				</div>
				<div className='flex items-center gap-1.5'>
					<NoTextReviewSvgIcon classname='size-4 xl:size-6' />
					<span className='font-semibold'>{item.no_text_count}</span>
				</div>
				{/* </div> */}
			</TooltipSpan>

			<TooltipSpan
				tooltip={
					<ToolTip>
						<div className='font-medium space-y-1'>
							<div className='flex gap-x-2'>
								<HeartFilledSvgIcon />
								Получено лайков на свои рецензии от пользователей
							</div>
							<div className='flex gap-x-2'>
								<HeartSvgIcon />
								Поставлено лайков на рецензии пользователей
							</div>
						</div>
					</ToolTip>
				}
				spanClassName={
					'bg-zinc-950 border border-white/10 flex xl:flex-col max-xl:order-6 h-7 xl:h-full text-[10px] sm:text-sm items-center justify-center gap-1 lg:gap-2 px-1 xl:px-4 rounded-lg relative min-w-[100px]'
				}
				centered={true}
			>
				{/* <div className='bg-zinc-950 border border-white/10 flex xl:flex-col max-xl:order-6 h-7 xl:h-full text-[10px] sm:text-sm items-center justify-center gap-1 lg:gap-2 px-1 xl:px-4 rounded-lg relative min-w-[100px]'> */}
				<div className='flex items-center gap-1.5'>
					<HeartFilledSvgIcon />
					<span className='font-semibold'>
						{formatNumber(item.received_likes)}
					</span>
				</div>
				<div className='flex items-center gap-1.5'>
					<HeartSvgIcon />
					<span className='font-semibold'>
						{formatNumber(item.given_likes)}
					</span>
				</div>
				{/* </div> */}
			</TooltipSpan>
		</div>
	)
}

export default LBItem
