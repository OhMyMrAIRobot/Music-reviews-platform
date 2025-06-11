import { FC } from 'react'
import { IAuthor } from '../../model/author/author'
import { ReleaseTypesEnum } from '../../model/release/release-types'
import AuthorReleaseTypesRatings from '../authorsPage/AuthorReleaseTypesRatings'

interface IProps {
	author: IAuthor
}

const AuthorPageStats: FC<IProps> = ({ author }) => {
	return (
		<section>
			<div className='bg-zinc-900 px-5 py-3 lg:p-5 rounded-2xl border border-white/20 w-80 select-none grid gap-3'>
				<p className='lg:text-xl font-bold lg:mb-4'>Средний балл</p>
				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.SINGLE}
					stats={author.release_type_stats}
				/>
				<AuthorReleaseTypesRatings
					releaseType={ReleaseTypesEnum.ALBUM}
					stats={author.release_type_stats}
				/>
			</div>
		</section>
	)
}

export default AuthorPageStats
