import { useEffect } from 'react'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'

const AlbumValuesPage = () => {
	const { albumValuesPageStore } = useStore()

	const { execute: fetch } = useLoading(albumValuesPageStore.fetchAlbumValues)

	useEffect(() => {
		fetch(null, null, null, null)
	}, [fetch])

	return (
		<>
			<h1
				id='album-values'
				className='text-lg md:text-xl lg:text-3xl font-semibold'
			>
				Ценность альбомов
			</h1>
		</>
	)
}

export default AlbumValuesPage
