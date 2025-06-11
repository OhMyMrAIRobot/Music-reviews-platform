import { FC } from 'react'
import { IRelease } from '../../../model/release/release'
import AuthorPageReleaseItem from './AuthorPageReleaseItem'

interface IProps {
	title: string
	releases: IRelease[]
}

const AuthorsPageReleasesCol: FC<IProps> = ({ title, releases }) => {
	return (
		<div>
			<div className='inline-flex items-center px-2 py-1 rounded-lg bg-zinc-900 font-semibold text-sm '>
				{releases.length === 0 ? `${title} не найдены!` : title}
			</div>
			<div className='flex flex-col gap-y-1.5 lg:gap-y-3 mt-4'>
				{releases.map(release => (
					<AuthorPageReleaseItem release={release} key={release.id} />
				))}
			</div>
		</div>
	)
}

export default AuthorsPageReleasesCol
