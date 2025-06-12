import { FC } from 'react'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { IRelease } from '../../models/release/release'
import { NoTextReviewSvgIcon, TextReviewSvgIcon } from '../svg/ReleaseSvgIcons'
import ReleaseAuthors from './Release-authors'
import ReleaseRatings from './Release-ratings'
import ReleaseTypeIcon from './Release-type-icon'

interface IProps {
	release?: IRelease
	isLoading: boolean
}

const ReleaseCard: FC<IProps> = ({ release, isLoading }) => {
	const { navigateToRelease } = useCustomNavigate()

	return isLoading ? (
		<div className='bg-gray-400 w-full h-full animate-pulse opacity-40'></div>
	) : (
		release && (
			<button
				onClick={() => navigateToRelease(release.id)}
				className='bg-zinc-900 hover:scale-105 p-1 overflow-hidden flex flex-col justify-start relative w-full h-full rounded-xl border border-zinc-800 duration-300 cursor-pointer'
			>
				<div className='relative block aspect-square'>
					<div className='rounded-lg size-full min-h-35'>
						<img
							alt={release.title}
							loading='lazy'
							decoding='async'
							className='rounded-lg'
							src={`${import.meta.env.VITE_SERVER_URL}/public/releases/${
								release.img
							}`}
						/>
					</div>
					{(release.text_count > 0 || release.no_text_count > 0) && (
						<div className='absolute bottom-1.5 left-1.5 bg-zinc-900 rounded-full px-1.5 flex gap-2 items-center font-semibold text-sm'>
							{release.text_count > 0 && (
								<div className='flex gap-0.75 items-center'>
									<TextReviewSvgIcon classname='size-3' />
									<span>{release.text_count}</span>
								</div>
							)}
							{release.no_text_count > 0 && (
								<div className='flex gap-0.75 items-center'>
									<NoTextReviewSvgIcon classname='size-3' />
									<span>{release.no_text_count}</span>
								</div>
							)}
						</div>
					)}
					<div className='absolute bottom-1.5 right-1.5 bg-zinc-900 size-6 rounded-full flex items-center justify-center'>
						<ReleaseTypeIcon
							type={release.release_type}
							className={'relative size-4'}
						/>
					</div>
				</div>
				<div className='mt-1.5 relative'>
					<p className='text-sm font-bold text-white leading-4 block antialiased text-left'>
						{release.title}
					</p>
				</div>

				<ReleaseAuthors
					authors={release.author}
					className='text-[13px] font-medium'
				/>

				<div className='flex items-center px-1 pb-1 gap-1 text-white mt-auto pt-5'>
					<ReleaseRatings
						ratings={release.ratings}
						className={'size-7 text-xs'}
					/>
				</div>
			</button>
		)
	)
}

export default ReleaseCard
