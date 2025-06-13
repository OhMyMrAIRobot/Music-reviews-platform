import { useEffect } from 'react'
import { useParams } from 'react-router'
import Loader from '../components/loader/loader'
import ProfileLeftSection from '../components/profile/ProfileLeftSection'
import ProfileRightSection from '../components/profile/ProfileRightSection'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'

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
	}, [id])
	const profile = profileStore.profile

	return isLoading ? (
		<Loader />
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
