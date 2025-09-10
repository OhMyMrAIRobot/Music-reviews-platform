import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useLoading } from '../../../../../hooks/use-loading.ts'
import { useStore } from '../../../../../hooks/use-store.ts'
import ProfilePreferencesGridRow from './Profile-preferences-grid-row.tsx'

const ProfilePreferencesGrid = () => {
	const { id } = useParams()

	const { profilePageStore } = useStore()

	const { execute: fetch, isLoading } = useLoading(
		profilePageStore.fetchPreferred
	)

	useEffect(() => {
		if (id) {
			fetch(id)
		}
	}, [fetch, id])

	return (
		<div className='grid lg:grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-10'>
			<ProfilePreferencesGridRow
				title={'Артисты'}
				items={profilePageStore.preferred?.artists ?? []}
				isAuthor={true}
				isLoading={isLoading}
			/>

			<ProfilePreferencesGridRow
				title={'Альбомы'}
				items={profilePageStore.preferred?.albums ?? []}
				isAuthor={false}
				isLoading={isLoading}
			/>

			<ProfilePreferencesGridRow
				title={'Треки'}
				items={profilePageStore.preferred?.tracks ?? []}
				isAuthor={false}
				isLoading={isLoading}
			/>

			<ProfilePreferencesGridRow
				title={'Продюсеры'}
				items={profilePageStore.preferred?.producers ?? []}
				isAuthor={true}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default ProfilePreferencesGrid
