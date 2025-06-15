import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import Loader from '../Loader.tsx'
import PreferProfileGridItem from './PreferProfileGridItem'

const PreferProfileGrid = () => {
	const { id } = useParams()
	const { profileStore } = useStore()
	const { execute: fetch, isLoading } = useLoading(profileStore.fetchPreferred)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [])

	return isLoading ? (
		<Loader className={'size-20'} />
	) : (
		profileStore.preferred && (
			<div className='mt-5 grid lg:grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-10'>
				<PreferProfileGridItem
					title={'Артисты'}
					items={profileStore.preferred.artists ?? []}
					isAuthor={true}
				/>
				<PreferProfileGridItem
					title={'Альбомы'}
					items={profileStore.preferred.albums ?? []}
					isAuthor={false}
				/>
				<PreferProfileGridItem
					title={'Треки'}
					items={profileStore.preferred.tracks ?? []}
					isAuthor={false}
				/>
				<PreferProfileGridItem
					title={'Продюсеры'}
					items={profileStore.preferred.producers ?? []}
					isAuthor={true}
				/>
			</div>
		)
	)
}

export default PreferProfileGrid
