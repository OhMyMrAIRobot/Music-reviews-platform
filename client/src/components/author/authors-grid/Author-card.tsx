import { FC } from 'react'
import useCustomNavigate from '../../../hooks/use-custom-navigate'
import { IAuthorData } from '../../../models/author/authors-response'
import { ReleaseTypesEnum } from '../../../models/release/release-types'
import LikesCount from '../../utils/Likes-count'
import SkeletonLoader from '../../utils/Skeleton-loader'
import AuthorReleaseTypesRatings from '../author-ratings/Author-release-types-ratings'
import AuthorTypes from '../author-types/Author-types'

interface IProps {
	author?: IAuthorData
	isLoading: boolean
}

const AuthorCard: FC<IProps> = ({ author, isLoading }) => {
	const { navigateToAuthor } = useCustomNavigate()

	return isLoading ? (
		<SkeletonLoader className={'w-full h-76 md:h-91 rounded-2xl'} />
	) : (
		author && (
			<button
				onClick={() => navigateToAuthor(author.id)}
				className='border border-white/10 bg-zinc-900 shadow-sm p-3 rounded-2xl text-center cursor-pointer select-none flex flex-col gap-y-2'
			>
				<div className='aspect-square max-w-30 md:max-w-45 w-full mx-auto relative rounded-full overflow-hidden'>
					<img
						alt={author.name}
						decoding='async'
						loading='lazy'
						src={`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
							author.img === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: author.img
						}`}
						className='size-full object-cover object-center'
					/>
				</div>

				<div className='text-sm md:text-xl font-semibold flex items-center justify-center gap-x-1'>
					<span>{author.name}</span>
					<AuthorTypes types={author.author_types} />
				</div>

				<LikesCount count={author.likes_count} />

				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.SINGLE}
					stats={author.release_type_stats}
				/>

				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.ALBUM}
					stats={author.release_type_stats}
				/>
			</button>
		)
	)
}

export default AuthorCard
