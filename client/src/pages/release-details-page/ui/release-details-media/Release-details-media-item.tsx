import { FC } from 'react'
import { IReleaseMedia } from '../../../../models/release-media/release-media'
import { parseYoutubeId } from '../../../../utils/parse-youtube-id'

interface IProps {
	releaseMedia: IReleaseMedia
}

const ReleaseDetailsMediaItem: FC<IProps> = ({ releaseMedia }) => {
	return (
		<div className='w-[230px]'>
			<a
				href={releaseMedia.url}
				target='_blank'
				className='block p-1.5 rounded-lg bg-zinc-900 border border-white/10'
			>
				<img
					alt='ttt'
					loading='lazy'
					decoding='async'
					className='block aspect-video relative rounded-md overflow-hidden'
					src={`https://img.youtube.com/vi/${parseYoutubeId(
						releaseMedia.url
					)}/mqdefault.jpg`}
				/>
			</a>

			<a target='_blank' href={releaseMedia.url}>
				<span className='overflow-ellipsis mt-2 text-sm font-bold whitespace-nowrap block overflow-hidden max-w-full hover:underline underline-offset-4'>
					{releaseMedia.title}
				</span>
			</a>
		</div>
	)
}

export default ReleaseDetailsMediaItem
