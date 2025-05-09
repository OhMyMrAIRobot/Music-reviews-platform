import { useEffect } from 'react'
import { useParams } from 'react-router'
import Loader from '../components/Loader'
import ProfileLeftSection from '../components/profile/ProfileLeftSection'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'

const ProfilePage = () => {
	const { id } = useParams()

	const { profileStore } = useStore()
	const { execute: fetchProfile, isLoading } = useLoading(
		profileStore.fetchProfile
	)

	useEffect(() => {
		if (id) {
			fetchProfile(id)
		}
	}, [])
	const profile = profileStore.profile

	return isLoading ? (
		<Loader />
	) : (
		profile && (
			<div className='grid grid-cols-1 xl:grid-cols-10 gap-5'>
				<ProfileLeftSection profile={profile} />
			</div>
		)
	)
}

export default ProfilePage
