import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import useCustomNavigate from '../../hooks/use-custom-navigate'
import { useStore } from '../../hooks/use-store'
import UpdateProfileInfoForm from './ui/forms/Update-profile-info-form'
import UploadAvatarForm from './ui/forms/Upload-avatar-form'
import UploadCoverForm from './ui/forms/Upload-cover-form'

const EditProfilePage = observer(() => {
	const { id } = useParams()

	const { authStore } = useStore()

	const { navigateToMain } = useCustomNavigate()

	useEffect(() => {
		if (!authStore.isAuth || authStore.user?.id !== id) {
			navigateToMain()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='flex flex-col min-h-screen bg-white/5 -mt-10 gap-y-10 items-center pb-10'>
			<h1 className='text-3xl font-semibold mt-10'>Настройки профиля</h1>
			<UploadAvatarForm />
			<UploadCoverForm />
			<UpdateProfileInfoForm />
		</div>
	)
})

export default EditProfilePage
