import { useEffect } from 'react'
import { useParams } from 'react-router'
import Loader from '../../components/utils/Loader.tsx'
import { useLoading } from '../../hooks/use-loading.ts'
import { useStore } from '../../hooks/use-store.ts'
import ProfileLeftSection from './ui/profile-left-section/Profile-left-section.tsx'
import ProfileRightSection from './ui/profile-right-section/Profile-right-section.tsx'

const ProfilePage = () => {
	const { id } = useParams()

	const { profilePageStore } = useStore()

	const { execute: fetchProfile, isLoading } = useLoading(
		profilePageStore.fetchProfile
	)

	useEffect(() => {
		if (id) {
			fetchProfile(id)
		}
	}, [fetchProfile, id])

	const profile = profilePageStore.profile

	return isLoading ? (
		<Loader className={'mx-auto size-20 border-white'} />
	) : (
		profile && (
			<div className='grid grid-cols-1 xl:grid-cols-10 gap-5'>
				<ProfileLeftSection profile={profile} />
				<ProfileRightSection profile={profile} />
			</div>
		)
	)
}

export default ProfilePage
