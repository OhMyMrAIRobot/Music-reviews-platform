import { FC } from 'react'
import HourglassSvg from '../../../../components/svg/Hourglass-svg'
import RejectSvg from '../../../../components/svg/Reject-svg'
import { ReleaseMediaStatusesEnum } from '../../../../models/release-media-status/release-media-statuses-enum'
import { IReleaseMedia } from '../../../../models/release-media/release-media'
import { parseYoutubeId } from '../../../../utils/parse-youtube-id'

interface IProps {
	releaseMedia: IReleaseMedia
}

const ReleaseDetailsMediaItem: FC<IProps> = ({ releaseMedia }) => {
	const isApproved =
		releaseMedia.releaseMediaStatus.status === ReleaseMediaStatusesEnum.APPROVED

	return (
		<div className={`w-[230px]`}>
			<a
				href={releaseMedia.url}
				target='_blank'
				className={`block p-1.5 rounded-lg bg-zinc-900 border  relative ${
					isApproved ? 'border-white/10' : 'border-white/1'
				}`}
			>
				<img
					alt={releaseMedia.title}
					loading='lazy'
					decoding='async'
					className={`block aspect-video rounded-md overflow-hidden select-none ${
						isApproved ? '' : 'opacity-35'
					}`}
					src={`https://img.youtube.com/vi/${parseYoutubeId(
						releaseMedia.url
					)}/mqdefault.jpg`}
				/>

				{releaseMedia.releaseMediaStatus.status ===
					ReleaseMediaStatusesEnum.PENDING && (
					<div className='absolute inset-0 flex flex-col gap-y-1.5 items-center justify-center text-sm font-medium text-yellow-700 bg-black/60 rounded-lg text-center'>
						<HourglassSvg className={'size-6 '} />
						<span>{ReleaseMediaStatusesEnum.PENDING}</span>
					</div>
				)}

				{releaseMedia.releaseMediaStatus.status ===
					ReleaseMediaStatusesEnum.REJECTED && (
					<div className='absolute inset-0 flex flex-col items-center justify-center text-sm font-medium text-red-800 bg-black/60 rounded-lg text-center'>
						<RejectSvg className={'size-6 '} />
						<span>{ReleaseMediaStatusesEnum.REJECTED}</span>
					</div>
				)}
			</a>

			<a
				target='_blank'
				href={releaseMedia.url}
				className={`${isApproved ? '' : 'opacity-35'}`}
			>
				<span className='line-clamp-1 mt-2 text-sm font-bold whitespace-nowrap overflow-hidden max-w-full hover:underline underline-offset-4 text-ellipsis'>
					{releaseMedia.title}
				</span>
			</a>
		</div>
	)
}

export default ReleaseDetailsMediaItem
