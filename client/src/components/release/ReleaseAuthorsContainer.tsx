import { FC } from 'react'
import { AuthorTypesEnum } from '../../models/author/AuthorTypes'
import { IReleaseDetails } from '../../models/release/ReleaseDetails'
import ReleaseAuthor from './ReleaseAuthor'

interface IProps {
	release: IReleaseDetails
}

const ReleaseAuthorsContainer: FC<IProps> = ({ release }) => {
	return (
		<div className='select-none mt-5 flex flex-wrap justify-center lg:justify-start gap-x-2 lg:gap-x-5 items-center lg:-ml-3'>
			{release.artists?.map(artist => (
				<ReleaseAuthor
					img={artist.img}
					name={artist.name}
					type={AuthorTypesEnum.ARTIST}
					key={artist.name}
				/>
			))}
			{release?.producers && (
				<div className='flex gap-x-1.5 items-center'>
					<span className='opacity-70 font-medium'>prod.</span>
					{release.producers?.map(producer => (
						<ReleaseAuthor
							img={producer.img}
							name={producer.name}
							type={AuthorTypesEnum.PRODUCER}
							key={producer.name}
						/>
					))}
				</div>
			)}
			{release?.designers && (
				<div className='flex gap-x-1.5 items-center'>
					<span className='opacity-70 font-medium'>cover by</span>
					{release.designers?.map(designer => (
						<ReleaseAuthor
							img={designer.img}
							name={designer.name}
							type={AuthorTypesEnum.DESIGNER}
							key={designer.name}
						/>
					))}
				</div>
			)}
			<div className='bg-white/10 w-[1px] h-5 max-lg:mx-2'></div>
			<div className='text-white font-medium max-lg:text-sm'>
				{release?.year}
			</div>
		</div>
	)
}

export default ReleaseAuthorsContainer
