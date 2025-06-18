import { FC } from 'react'
import AuthorReleaseTypesRatings from '../../../components/author/author-ratings/Author-release-types-ratings'
import { IAuthor } from '../../../models/author/author'
import { ReleaseTypesEnum } from '../../../models/release/release-types'

interface IProps {
	author?: IAuthor
	isLoading: boolean
}

const AuthorDetailsStats: FC<IProps> = ({ author, isLoading }) => {
	return (
		<section>
			{isLoading ? (
				<div className='bg-gray-400 animate-pulse opacity-40 w-80 rounded-2xl h-34 lg:43' />
			) : (
				author && (
					<div className='bg-zinc-900 px-5 py-3 lg:p-5 rounded-2xl border border-white/20 w-80 select-none grid gap-3'>
						<p className='lg:text-xl font-bold lg:mb-4'>Средняя оценка</p>
						<AuthorReleaseTypesRatings
							releaseType={ReleaseTypesEnum.SINGLE}
							stats={author.release_type_stats}
						/>
						<AuthorReleaseTypesRatings
							releaseType={ReleaseTypesEnum.ALBUM}
							stats={author.release_type_stats}
						/>
					</div>
				)
			)}
		</section>
	)
}

export default AuthorDetailsStats
