import UpdateProfileInfoForm from './ui/forms/Update-profile-info-form'
import UpdateProfileSocialsForm from './ui/forms/Update-profile-socials-form'
import UpdateUserInfoForm from './ui/forms/Update-user-info-form'
import UploadAvatarForm from './ui/forms/Upload-avatar-form'
import UploadCoverForm from './ui/forms/Upload-cover-form'

const EditProfilePage = () => {
	return (
		<div className='flex flex-col min-h-screen w-full bg-white/5 -mt-10 gap-y-10 items-center pb-10 px-5'>
			<h1 className='text-3xl font-semibold mt-10'>Настройки профиля</h1>
			<UploadAvatarForm />
			<UploadCoverForm />
			<UpdateUserInfoForm />
			<UpdateProfileInfoForm />
			<UpdateProfileSocialsForm />
		</div>
	)
}

export default EditProfilePage
