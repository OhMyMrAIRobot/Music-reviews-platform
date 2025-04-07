import { FC } from 'react'
import { IReleaseDetails } from '../../models/release/ReleaseDetails'
import ReleaseAuthorsContainer from './ReleaseAuthorsContainer'
import ReleaseRatingsContainer from './ReleaseRatingsContainer'

interface IProps {
	release: IReleaseDetails
}

const ReleaseDetailsCard: FC<IProps> = ({ release }) => {
	return (
		<div className='lg:p-5 lg:bg-zinc-900 lg:border lg:border-white/10 rounded-2xl flex items-center lg:items-start max-lg:flex-col gap-y-3'>
			<img
				loading='lazy'
				decoding='async'
				alt={release.title}
				src={release.release_img}
				className='size-62 rounded-[10px] max-h-62'
			/>
			<div className='absolute w-full flex justify-center lg:hidden z-[-1] blur-2xl'>
				<img
					loading='lazy'
					decoding='async'
					alt={release.title}
					src={release.release_img}
					className='size-62 rounded-[10px] max-h-62'
				/>
			</div>

			<div className='lg:pl-8 gap-3 lg:h-62 flex justify-between lg:text-left flex-col text-center'>
				<div>
					<p className='text-white opacity-70 text-xs font-semibold'>
						{release.release_type}
					</p>
					<p className='text-2xl lg:text-3xl xl:text-5xl font-extrabold mt-2'>
						{release.title}
					</p>
					<ReleaseAuthorsContainer release={release} />
				</div>

				<ReleaseRatingsContainer release={release} />
			</div>
		</div>
	)
}

export default ReleaseDetailsCard
