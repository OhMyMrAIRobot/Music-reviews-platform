import { FC } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { IRelease } from '../../../models/release/Release'
import { ReleaseRatingTypesEnum } from '../../../models/release/ReleaseRatingTypes'
import { ReleaseTypesEnum } from '../../../models/release/ReleaseTypes'
import {
	AlbumSvgIcon,
	NoTextReviewSvgIcon,
	SingleSvgIcon,
	TextReviewSvgIcon,
} from '../../svg/ReleaseSvgIcons'

interface IProps {
	release: IRelease
}

const getReleaseIcon = (releaseType: string) => {
	switch (releaseType) {
		case ReleaseTypesEnum.ALBUM:
			return <AlbumSvgIcon />
		case ReleaseTypesEnum.SINGLE:
			return <SingleSvgIcon />
		default:
			return <SingleSvgIcon />
	}
}

const LastReleasesCarouselItem: FC<IProps> = ({ release }) => {
	const { navigateToRelease } = useCustomNavigate()
	const ratingOrder = [
		ReleaseRatingTypesEnum.SUPER_USER,
		ReleaseRatingTypesEnum.WITH_TEXT,
		ReleaseRatingTypesEnum.NO_TEXT,
	]

	const ratings = ratingOrder
		.map(type => release.ratings.find(r => r.type === type))
		.filter(r => r && r.total > 0)

	return (
		<button
			onClick={() => navigateToRelease(release.id)}
			className='bg-secondary hover:scale-105 p-1 overflow-hidden flex flex-col justify-start relative w-full h-full rounded-xl border border-zinc-800 duration-300 cursor-pointer'
		>
			<div className='relative'>
				<img
					loading='lazy'
					decoding='async'
					className='rounded-lg'
					src={release.img}
				/>
				{(release.text_count > 0 || release.no_text_count > 0) && (
					<div className='absolute bottom-1.5 left-1.5 bg-zinc-900 rounded-full px-1.5 flex gap-2 items-center font-semibold text-sm'>
						{release.text_count > 0 && (
							<div className='flex gap-0.75 items-center'>
								<TextReviewSvgIcon />
								<span>{release.text_count}</span>
							</div>
						)}
						{release.no_text_count > 0 && (
							<div className='flex gap-0.75 items-center'>
								<NoTextReviewSvgIcon />
								<span>{release.no_text_count}</span>
							</div>
						)}
					</div>
				)}
				<div className='absolute bottom-1.5 right-1.5 bg-zinc-900 size-6 rounded-full flex items-center justify-center'>
					{getReleaseIcon(release.release_type)}
				</div>
			</div>
			<div className='mt-1.5 relative'>
				<p className='text-sm font-bold text-white leading-4 block antialiased text-left'>
					{release.title}
				</p>
			</div>
			<div className='flex flex-wrap gap-1 font-medium leading-3 mt-2 text-[13px]'>
				{release.author.map(author => (
					<div key={author.name} className='opacity-70'>
						{author.name}
					</div>
				))}
			</div>
			<div className='flex mt-5 items-center px-1 pb-1 gap-1 text-white'>
				{ratings.map(rating => {
					let className =
						'inline-flex size-7 text-xs items-center justify-center font-semibold rounded-full '

					if (rating?.type === ReleaseRatingTypesEnum.SUPER_USER) {
						className += 'bg-[rgba(255,255,255,.1)]'
					} else if (rating?.type === ReleaseRatingTypesEnum.WITH_TEXT) {
						className += 'bg-[rgba(35,101,199)]'
					} else if (rating?.type === ReleaseRatingTypesEnum.NO_TEXT) {
						className += 'border-2 border-[rgba(35,101,199)]'
					}

					return (
						<div key={rating?.type} className={className}>
							{rating?.total}
						</div>
					)
				})}
			</div>
		</button>
	)
}

export default LastReleasesCarouselItem
