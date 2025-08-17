import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { AuthorTypesEnum } from '../../../../models/author/author-type/author-types-enum'
import { IReleaseDetailsAuthor } from '../../../../models/release/release-details/release-details-author'

interface IProps {
	author: IReleaseDetailsAuthor
	type: AuthorTypesEnum
}

const ReleaseDetailsAuthorsItem: FC<IProps> = ({ author, type }) => {
	const { navigateToAuthorDetails } = useNavigationPath()

	return (
		<Link
			to={navigateToAuthorDetails(author.id)}
			className={`flex items-center justify-center text-sm font-medium h-10 gap-x-1.5 lg:gap-x-2 hover:bg-white/10 transition-colors duration-200 px-1 py-2 
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
					loading='lazy'
					decoding='async'
					alt={author.name}
					src={`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
						author.img === '' ? import.meta.env.VITE_DEFAULT_AVATAR : author.img
					}`}
					className='size-full object-cover aspect-square'
				/>
			</div>
			<span className='font-bold'>{author.name}</span>
		</Link>
	)
}

export default ReleaseDetailsAuthorsItem
