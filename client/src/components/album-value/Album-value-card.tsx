import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../hooks/use-navigation-path'
import { IAlbumValue } from '../../models/album-value/album-value'
import {
	getAlbumValueTier,
	getAlbumValueTierConfig,
} from '../../utils/album-value-config'
import ReleaseAuthors from '../release/Release-authors'
import TooltipSpan from '../tooltip/Tooltip-span'
import SkeletonLoader from '../utils/Skeleton-loader'
import AlbumValueTooltip from './Album-value-tooltip'

interface IProps {
	isLoading: boolean
	value?: IAlbumValue
	smallSize?: boolean
}

const AlbumValueCard: FC<IProps> = ({
	isLoading,
	value,
	smallSize = false,
}) => {
	const { navigateToReleaseDetails } = useNavigationPath()

	if (isLoading || !value) {
		return <SkeletonLoader className='rounded-[25px] w-full h-100' />
	}

	const level = getAlbumValueTier(value.totalValue)

	if (!level) return null

	const config = getAlbumValueTierConfig(level)

	return (
		<div
			className={`bg-zinc-900/40 hover:bg-zinc-900 p-2 lg:p-3 lg:pb-4 rounded-[25px] flex flex-col justify-start relative w-full h-full border duration-300 overflow-hidden ${config.borderColor}`}
		>
			<div
				className={`absolute inset-0 opacity-15 bg-gradient-to-br pointer-events-none ${config.gradient}`}
			/>
			<Link
				to={navigateToReleaseDetails(value.release.id)}
				className='relative z-10'
			>
				<img
					alt={value.release.title}
					loading='lazy'
					decoding='async'
					className='w-full rounded-[15px] lg:rounded-[20px]'
					src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
						value.release.img === ''
							? import.meta.env.VITE_DEFAULT_COVER
							: value.release.img
					}`}
				/>
			</Link>

			<div className='my-2 lg:mt-[15px] mb-2 relative z-10'>
				<span
					className={`text-center w-full text-white font-semibold block ${
						smallSize ? 'text-sm' : 'text-base !leading-[22px]'
					}`}
				>
					<Link
						to={navigateToReleaseDetails(value.release.id)}
						className='relative z-10'
					>
						{value.release.title}
					</Link>

					<ReleaseAuthors
						authors={value.release.authors}
						className={`justify-center font-normal ${
							smallSize ? 'text-sm' : 'text-lg'
						}`}
					/>
				</span>
			</div>

			<TooltipSpan
				tooltip={
					<AlbumValueTooltip
						value={value}
						className={`${smallSize ? 'min-w-42' : 'min-w-50'}`}
					/>
				}
				centered={true}
				spanClassName='relative py-1 flex gap-2 w-full max-w-[140px] lg:max-w-[205px] mx-auto items-center justify-start pl-2.5 text-center mt-auto relative z-10 rounded-full'
			>
				<div
					className={`absolute inset-0 rounded-full opacity-20 bg-gradient-to-br pointer-events-none ${config.gradient}`}
				/>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
						config.image
					}`}
					className={`${smallSize ? 'w-12' : 'w-10 lg:w-[75px]'}`}
				/>
				<span
					className={`cursor-default font-bold ${
						smallSize ? 'text-xl' : 'text-[24px] 2xl:text-[32px]'
					}`}
				>
					{value.totalValue}
				</span>
			</TooltipSpan>
		</div>
	)
}

export default AlbumValueCard
