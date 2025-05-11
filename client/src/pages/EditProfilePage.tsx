import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import UploadAvatarForm from '../components/editProfilePage/UploadAvatarForm'
import UploadCoverForm from '../components/editProfilePage/UploadCoverForm'
import useCustomNavigate from '../hooks/UseCustomNavigate'
import { useStore } from '../hooks/UseStore'

const EditProfilePage = observer(() => {
	const { authStore } = useStore()
	const { navigateToMain } = useCustomNavigate()
	const { id } = useParams()

	useEffect(() => {
		if (!authStore.isAuth || authStore.user?.id !== id) {
			navigateToMain()
		}
	}, [])

	return (
		<div className='flex flex-col min-h-screen bg-white/5 -mt-10 gap-y-10 items-center pb-10'>
			<h1 className='text-3xl font-semibold mt-10'>Настройки профиля</h1>
			<UploadAvatarForm />
			<UploadCoverForm />
		</div>
	)
})

export default EditProfilePage
