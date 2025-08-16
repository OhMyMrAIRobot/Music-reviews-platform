import { FC } from 'react'
import { Link } from 'react-router'
import useNavigationPath from '../../../hooks/use-navigation-path'
import { IAuthor } from '../../../models/author/author'
import { ReleaseTypesEnum } from '../../../models/release/release-type/release-types-enum'
import RegisteredAuthorTypes from '../../registered-author/Registered-author-types'
import LikesCount from '../../utils/Likes-count'
import SkeletonLoader from '../../utils/Skeleton-loader'
import AuthorReleaseTypesRatings from '../author-ratings/Author-release-types-ratings'
import AuthorTypes from '../author-types/Author-types'

interface IProps {
	author?: IAuthor
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
							author.img === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: author.img
						}`}
						className='size-full object-cover object-center'
					/>
				</div>

				<div className='text-sm md:text-xl font-semibold flex items-center justify-center gap-x-1'>
					<span>{author.name}</span>
					{author.isRegistered ? (
						<RegisteredAuthorTypes
							types={author.authorTypes}
							className='size-7'
						/>
					) : (
						<AuthorTypes types={author.authorTypes} className='size-7' />
					)}
				</div>

				<LikesCount count={author.favCount} />

				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.SINGLE}
					stats={author.releaseTypeRatings}
				/>

				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.ALBUM}
					stats={author.releaseTypeRatings}
				/>
			</Link>
		)
	)
}

export default AuthorCard
