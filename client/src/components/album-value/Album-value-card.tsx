import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../hooks/use-navigation-path'
import { IAlbumValue } from '../../models/album-value/album-value'
import {
	getAlbumValueTier,
	getAlbumValueTierConfig,
} from '../../utils/album-value-config'
import ReleaseAuthors from '../release/Release-authors'
import SkeletonLoader from '../utils/Skeleton-loader'

interface IProps {
	isLoading: boolean
	value?: IAlbumValue
}

const AlbumValueCard: FC<IProps> = ({ isLoading, value }) => {
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
				<span className='text-base !leading-[22px] text-center w-full text-white font-semibold block'>
					<Link
						to={navigateToReleaseDetails(value.release.id)}
						className='relative z-10'
					>
						{value.release.title}
					</Link>

					<ReleaseAuthors
						authors={value.release.authors}
						className='justify-center text-lg font-normal'
					/>
				</span>
			</div>

			<div className='py-1 flex gap-2 w-full max-w-[140px] lg:max-w-[205px] mx-auto items-center justify-start pl-2.5 text-center mt-auto relative z-10 rounded-full overflow-hidden'>
				<div
					className={`absolute inset-0 opacity-20 bg-gradient-to-br pointer-events-none ${config.gradient}`}
				/>
				<img
					loading='lazy'
					decoding='async'
					src={`${import.meta.env.VITE_SERVER_URL}/public/assets/${
						config.image
					}`}
					className='w-10 lg:w-[75px]'
				/>
				<span className='cursor-default text-[24px] 2xl:text-[32px] font-bold'>
					{value.totalValue}
				</span>
			</div>
		</div>
	)
}

export default AlbumValueCard
