import { FC } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { AuthorTypesEnum } from '../../../model/author/author-type'

interface IReleaseAuthorProps {
	id: string
	img: string
	name: string
	type: AuthorTypesEnum
}

const ReleaseAuthor: FC<IReleaseAuthorProps> = ({ id, img, name, type }) => {
	const { navigateToAuthor } = useCustomNavigate()
	return (
		<button
			onClick={() => navigateToAuthor(id)}
			className={`flex items-center justify-center text-sm font-medium h-10 gap-x-1.5 lg:gap-x-2 hover:bg-white/10 transition-colors duration-200 cursor-pointer px-1 py-2 
				${type === AuthorTypesEnum.ARTIST ? 'rounded-full lg:px-3' : ''}
				${
					type === AuthorTypesEnum.PRODUCER
						? 'rounded-md lg:px-2'
						: 'rounded-md lg:px-2'
				}
				`}
		>
			<div className='size-8 overflow-hidden rounded-full'>
				<img
					alt={name}
					src={`${
						import.meta.env.VITE_SERVER_URL
					}/public/authors/avatars/${img}`}
					loading='lazy'
					decoding='async'
					className='size-full object-cover'
				/>
			</div>
			<span className='font-bold'>{name}</span>
		</button>
	)
}

export default ReleaseAuthor
