import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { ReleaseAPI } from '../../../api/release/release-api'
import ReleasesColumn from '../../../components/release/releases-column/Releases-column'
import { ReleaseTypesEnum } from '../../../models/release/release-type/release-types-enum'
import { releasesKeys } from '../../../query-keys/releases-keys'

interface IProps {
	id: string
}

const AuthorDetailsReleases: FC<IProps> = ({ id }) => {
	const { data, isPending } = useQuery({
		queryKey: releasesKeys.byAuthor(id, true),
		queryFn: () => ReleaseAPI.fetchByAuthorId(id, true),
		staleTime: 1000 * 60 * 5,
	})
	const releases = data || []

	const tracks = releases.filter(
		val => val.releaseType === ReleaseTypesEnum.SINGLE
	)

	const albums = releases.filter(
		val => val.releaseType === ReleaseTypesEnum.ALBUM
	)

	return (
		<section className='flex flex-col gap-y-2'>
			<h2 className='text-lg lg:text-2xl font-semibold'>Релизы автора</h2>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
				<ReleasesColumn
					title={'Треки'}
					releases={tracks}
					isLoading={isPending}
				/>

				<ReleasesColumn
					title={'Альбомы'}
					releases={albums}
					isLoading={isPending}
				/>
			</div>
		</section>
	)
}

export default AuthorDetailsReleases
