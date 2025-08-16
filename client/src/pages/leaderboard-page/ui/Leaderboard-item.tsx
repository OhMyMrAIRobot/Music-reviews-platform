import { FC } from 'react'
import { Link } from 'react-router'
import AuthorLikeColorSvg from '../../../components/author/author-like/svg/Author-like-color-svg'
import NoTextReviewSvg from '../../../components/review/svg/No-text-review-svg'
import TextReviewSvg from '../../../components/review/svg/Text-review-svg'
import LogoSmallSvg from '../../../components/svg/Logo-small-svg'
import PixelHeartFillSvg from '../../../components/svg/Pixel-heart-fill-svg'
import PixelHeartSvg from '../../../components/svg/Pixel-heart-svg'
import Tooltip from '../../../components/tooltip/Tooltip'
import TooltipSpan from '../../../components/tooltip/Tooltip-span'
import SkeletonLoader from '../../../components/utils/Skeleton-loader'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { ILeaderboardItem } from '../../../models/leaderboard/leaderboard-item'
import { formatNumber } from '../../../utils/format-number'
import { getLevelConfig, getUserLevel } from '../../../utils/user-level'

interface IProps {
	item?: ILeaderboardItem
	isLoading: boolean
}

const LeaderboardItem: FC<IProps> = ({ item, isLoading }) => {
	const { navigatoToProfile } = useNavigationPath()

	const level = getUserLevel(item?.points ?? 0)

	return isLoading ? (
		<SkeletonLoader className='w-full h-25 lg:h-31 xl:h-19 rounded-lg' />
	) : (
		item && (
			<div className='bg-zinc-900 border border-white/10 flex max-xl:flex-wrap p-[3px] xl:pr-2 xl:h-[75px] max-xl:gap-y-2 rounded-lg items-stretch relative group xl:hover:bg-zinc-800 transition-all'>
				<div className='absolute max-xl:order-11 size-5 lg:size-8 xl:size-auto max-xl:text-[10px] z-20 max-xl:rounded-full max-xl:-top-2 max-xl:-left-2 bg-zinc-950 xl:relative border border-white/10 flex items-center justify-center aspect-square rounded-lg mr-1'>
					{item.rank}
				</div>

				<div className='h-full relative max-xl:order-3'>
					<div className='flex items-center text-[10px] sm:text-sm h-7 xl:h-full justify-center gap-1.5 xl:flex-col xl:ml-auto min-w-[75px] lg:min-w-[80px] px-2 font-semibold bg-zinc-950 border border-white/10 rounded-lg'>
						<LogoSmallSvg className={'w-[30px] h-[20px] size-5'} />

						<span className='leading-3 font-bold xl:text-lg'>
							{formatNumber(item.points)}
						</span>
					</div>
				</div>

				<Link
					to={navigatoToProfile(item.userId)}
					className='flex shrink-0 space-x-4 items-center relative max-xl:w-1/2 max-xl:order-1 pl-3'
				>
					<div className='relative z-20'>
						<span className='relative flex shrink-0 overflow-hidden rounded-full size-[40px] lg:size-[60px] border border-white/10'>
							<img
								loading='lazy'
								decoding='async'
								alt={item.nickname}
								className='aspect-square h-full w-full object-cover'
								src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
									item.avatar === ''
										? import.meta.env.VITE_DEFAULT_AVATAR
										: item.avatar
								}`}
							/>
						</span>

						{level && (
							<div className='absolute -bottom-0.5 -right-2'>
								<img
									alt={item.avatar + level}
									loading='lazy'
									decoding='async'
									width='38'
									height='38'
									className='size-6 lg:size-[38px]'
									src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
										getLevelConfig(level).image
									}`}
								/>
							</div>
						)}
					</div>

					<div className='w-[100px] xl:w-[200px]'>
						<div className='text-ellipsis max-w-full whitespace-nowrap overflow-hidden text-[12px] sm:text-lg font-semibold'>
							{item.nickname}
						</div>
					</div>
				</Link>

				<div className='h-14 sm:h-20 xl:h-auto relative xl:w-[260px] rounded-r-lg xl:rounded-r-2xl overflow-hidden xl:mr-5 max-xl:order-2 max-xl:w-1/2 xl:block shrink-0'>
					<div className='bg-gradient-to-r from-zinc-900 h-full w-full absolute top-0 left-[-1px] z-10' />
					<img
						alt='user cover'
						loading='lazy'
						decoding='async'
						className='object-cover'
						sizes='100vw'
						src={`${import.meta.env.VITE_SERVER_URL}/public/covers/${
							item.cover === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: item.cover
						}`}
					/>
				</div>

				<TooltipSpan
					tooltip={<Tooltip>Получено авторских лайков</Tooltip>}
					spanClassName={
						'bg-zinc-950 border border-white/10 max-xl:order-5 flex xl:flex-col text-[10px] sm:text-sm justify-center items-center px-1 xl:px-4 rounded-lg relative mr-1 xl:mr-2 min-w-[80px] ml-1'
					}
					centered={true}
				>
					<div className='flex xl:flex-col items-center justify-center gap-x-1.5 gap-y-0.5 font-medium size-full'>
						<AuthorLikeColorSvg className='size-5 lg:size-6.5' />

						<span className='font-semibold'>{item.receivedAuthorLikes}</span>
					</div>
				</TooltipSpan>

				<TooltipSpan
					tooltip={
						<Tooltip>
							<div className='font-medium space-y-1'>
								<div className='flex gap-x-1.5'>
									<TextReviewSvg className='size-5' />
									Написано рецензий
								</div>
								<div className='flex gap-x-1.5'>
									<NoTextReviewSvg className='size-5' />
									Поставлено оценок без рецензий
								</div>
							</div>
						</Tooltip>
					}
					spanClassName={
						'bg-zinc-950 border border-white/10 max-xl:order-6 flex xl:flex-col text-[10px] sm:text-sm justify-center items-center gap-1 lg:gap-2 px-1 xl:px-4 rounded-lg relative mr-1 xl:mr-2 min-w-[100px]'
					}
					centered={true}
				>
					<div className='flex items-center gap-1.5'>
						<TextReviewSvg className='size-4 xl:size-5' />
						<span className='font-semibold'>{item.textCount}</span>
					</div>
					<div className='flex items-center gap-1.5'>
						<NoTextReviewSvg className='size-4 xl:size-5' />
						<span className='font-semibold'>{item.withoutTextCount}</span>
					</div>
				</TooltipSpan>

				<TooltipSpan
					tooltip={
						<Tooltip>
							<div className='font-medium space-y-1'>
								<div className='flex gap-x-2'>
									<PixelHeartFillSvg className={'w-5 h-4.5'} />
									Получено лайков на свои рецензии от пользователей
								</div>
								<div className='flex gap-x-2'>
									<PixelHeartSvg className={'w-5 h-4.5'} />
									Поставлено лайков на рецензии пользователей
								</div>
							</div>
						</Tooltip>
					}
					spanClassName={
						'bg-zinc-950 border border-white/10 flex xl:flex-col max-xl:order-7 h-7 xl:h-full text-[10px] sm:text-sm items-center justify-center gap-1 lg:gap-2 px-1 xl:px-4 rounded-lg relative min-w-[100px]'
					}
					centered={true}
				>
					<div className='flex items-center gap-1.5'>
						<PixelHeartFillSvg className={'w-5 h-4.5]'} />

						<span className='font-semibold'>
							{formatNumber(item.receivedLikes)}
						</span>
					</div>
					<div className='flex items-center gap-1.5'>
						<PixelHeartSvg className={'w-5 h-4.5'} />

						<span className='font-semibold'>
							{formatNumber(item.givenLikes)}
						</span>
					</div>
				</TooltipSpan>

				<div className='hidden xl:flex ml-auto items-center gap-2.5'>
					{item.topAuthorLikers.map(author => (
						<Link
							to={navigatoToProfile(author.userId)}
							className='relative'
							key={author.userId}
						>
							<TooltipSpan
								tooltip={<Tooltip>{author.nickname}</Tooltip>}
								spanClassName=''
							>
								<span className='relative flex overflow-hidden rounded-full size-[38px] xl:size-[45px] border border-white/10'>
									<img
										loading='lazy'
										decoding='async'
										src={`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
											author.avatar === ''
												? import.meta.env.VITE_DEFAULT_AVATAR
												: author.avatar
										}`}
										className='object-cover object-center size-full'
									/>
								</span>
								<div className='absolute size-5 bg-zinc-950 -left-1 top-0 text-xs flex items-center justify-center rounded-full'>
									{author.count}
								</div>
							</TooltipSpan>
						</Link>
					))}
				</div>
			</div>
		)
	)
}

export default LeaderboardItem
