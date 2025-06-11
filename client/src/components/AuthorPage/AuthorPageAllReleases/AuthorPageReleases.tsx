import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../../hooks/use-loading'
import { useStore } from '../../../hooks/use-store'
import { ReleaseTypesEnum } from '../../../models/release/release-types'
import Loader from '../../Loader'
import AuthorsPageReleasesCol from './AuthorsPageReleasesCol'

const AuthorPageReleases = () => {
	const { id } = useParams()
	const { authorPageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		authorPageStore.fetchAllReleases
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [])

	const tracks = authorPageStore.allReleases.filter(
		val => val.release_type === ReleaseTypesEnum.SINGLE
	)

	const albums = authorPageStore.allReleases.filter(
		val => val.release_type === ReleaseTypesEnum.ALBUM
	)

	return (
		<section className='flex flex-col gap-y-2'>
			<h2 className='text-lg lg:text-2xl font-semibold'>Релизы автора</h2>
			{isLoading ? (
				<Loader />
			) : (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
					<AuthorsPageReleasesCol title={'Треки'} releases={tracks} />
					<AuthorsPageReleasesCol title={'Альбомы'} releases={albums} />
				</div>
			)}
		</section>
	)
}

export default AuthorPageReleases
