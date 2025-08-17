import { useEffect } from 'react'
import { useParams } from 'react-router'
import ReleasesColumn from '../../../components/release/releases-column/Releases-column'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { ReleaseTypesEnum } from '../../../models/release/release-type/release-types-enum'

const AuthorDetailsReleases = () => {
	const { id } = useParams()

	const { authorDetailsPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorDetailsPageStore.fetchAllReleases
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [fetch, id])

	const tracks = authorDetailsPageStore.allReleases.filter(
		val => val.releaseType === ReleaseTypesEnum.SINGLE
	)

	const albums = authorDetailsPageStore.allReleases.filter(
		val => val.releaseType === ReleaseTypesEnum.ALBUM
	)

	return (
		<section className='flex flex-col gap-y-2'>
			<h2 className='text-lg lg:text-2xl font-semibold'>Релизы автора</h2>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
				<ReleasesColumn
					title={'Треки'}
					releases={tracks}
					isLoading={isLoading}
				/>

				<ReleasesColumn
					title={'Альбомы'}
					releases={albums}
					isLoading={isLoading}
				/>
			</div>
		</section>
	)
}

export default AuthorDetailsReleases
