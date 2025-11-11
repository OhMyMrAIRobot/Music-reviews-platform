import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { ProfileAPI } from '../../../../../api/user/profile-api.ts'
import { profileKeys } from '../../../../../query-keys/profile-keys'
import ProfilePreferencesGridRow from './Profile-preferences-grid-row.tsx'

interface IProps {
	userId: string
}

const ProfilePreferencesGrid: FC<IProps> = ({ userId }) => {
	const queryKey = profileKeys.preferences(userId)
	const { data, isPending } = useQuery({
		queryKey,
		queryFn: () => ProfileAPI.fetchProfilePreferences(userId),
		staleTime: 1000 * 60 * 5,
	})

	const artists = data?.artists || []
	const albums = data?.albums || []
	const tracks = data?.tracks || []
	const producers = data?.producers || []

	return (
		<div className='grid lg:grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-10'>
			<ProfilePreferencesGridRow
				title={'Артисты'}
				items={artists}
				isAuthor={true}
				isLoading={isPending}
			/>

			<ProfilePreferencesGridRow
				title={'Альбомы'}
				items={albums}
				isAuthor={false}
				isLoading={isPending}
			/>

			<ProfilePreferencesGridRow
				title={'Треки'}
				items={tracks}
				isAuthor={false}
				isLoading={isPending}
			/>

			<ProfilePreferencesGridRow
				title={'Продюсеры'}
				items={producers}
				isAuthor={true}
				isLoading={isPending}
			/>
		</div>
	)
}

export default ProfilePreferencesGrid
