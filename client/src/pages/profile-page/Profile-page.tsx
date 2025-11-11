import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { ProfileAPI } from '../../api/user/profile-api'
import Loader from '../../components/utils/Loader.tsx'
import { profileKeys } from '../../query-keys/profile-keys'
import ProfileLeftSection from './ui/profile-left-section/Profile-left-section.tsx'
import ProfileRightSection from './ui/profile-right-section/Profile-right-section.tsx'

const ProfilePage = () => {
	const { id } = useParams()

	const { data: profile, isPending: isLoading } = useQuery({
		queryKey: id ? profileKeys.profile(id) : ['profile', 'unknown'],
		queryFn: async () => {
			if (!id) throw new Error('No profile id provided!')
			return ProfileAPI.fetchProfile(id)
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
	})

	if (isLoading) {
		return <Loader className={'mx-auto size-20 border-white'} />
	}

	return (
		profile && (
			<div className='grid grid-cols-1 xl:grid-cols-10 gap-5'>
				<ProfileLeftSection profile={profile} />
				<ProfileRightSection profile={profile} />
			</div>
		)
	)
}

export default ProfilePage
