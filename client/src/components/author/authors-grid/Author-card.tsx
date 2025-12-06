import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { Author } from '../../../types/author'
import { ReleaseTypesEnum } from '../../../types/release'
import LikesCount from '../../utils/Likes-count'
import SkeletonLoader from '../../utils/Skeleton-loader'
import AuthorNominations from '../author-nomination/Author-nominations'
import AuthorReleaseTypesRatings from '../author-ratings/Author-release-types-ratings'
import AuthorTypes from '../author-types/Author-types'
import RegisteredAuthorTypes from '../registered-author/Registered-author-types'

interface IProps {
	author?: Author
	isLoading: boolean
}

const AuthorCard: FC<IProps> = ({ author, isLoading }) => {
	const { navigateToAuthorDetails } = useNavigationPath()

	return isLoading ? (
		<SkeletonLoader className={'w-full h-76 md:h-91 rounded-2xl'} />
	) : (
		author && (
			<Link
				to={navigateToAuthorDetails(author.id)}
				className='border border-white/10 bg-zinc-900 shadow-sm p-3 rounded-2xl text-center select-none flex flex-col gap-y-2'
			>
				<div className='aspect-square max-w-30 md:max-w-45 w-full mx-auto relative rounded-full overflow-hidden'>
					<img
						alt={author.name}
						decoding='async'
						loading='lazy'
						src={`${import.meta.env.VITE_SERVER_URL}/public/authors/avatars/${
							author.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: author.avatar
						}`}
						className='size-full object-cover object-center'
					/>
				</div>

				<div className='text-sm md:text-xl font-semibold flex items-center justify-center gap-x-1'>
					<span>{author.name}</span>
					{author.isRegistered ? (
						<RegisteredAuthorTypes
							types={author.authorTypes}
							className='size-6 lg:size-7'
						/>
					) : (
						<AuthorTypes
							types={author.authorTypes}
							className='size-6 lg:size-7'
						/>
					)}
				</div>

				<LikesCount
					count={author.userFavAuthor.length}
					className='size-4 lg:size-5'
				/>

				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.SINGLE}
					stats={author.releaseTypeRatings}
				/>

				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.ALBUM}
					stats={author.releaseTypeRatings}
				/>

				{author.nominations.totalCount > 0 && (
					<div className='bg-zinc-800 border border-zinc-700 rounded-full flex items-center py-[6px] px-3 mt-3 justify-center'>
						<AuthorNominations
							winsCount={author.nominations.winsCount}
							totalCount={author.nominations.totalCount}
						/>
					</div>
				)}
			</Link>
		)
	)
}

export default AuthorCard
