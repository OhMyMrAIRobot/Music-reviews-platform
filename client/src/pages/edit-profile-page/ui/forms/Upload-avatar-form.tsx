import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { generateUUID } from '../../../../utils/generate-uuid'
import EditProfilePageSection from '../Edit-profile-page-section'
import SelectImageLabel from '../labels/Select-image-label'
import SelectedImageLabel from '../labels/Selected-image-label'

const UploadAvatarForm = observer(() => {
	const { checkAuth } = useAuth()

	const { profileStore, notificationStore } = useStore()

	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const { execute: updateAvatar, isLoading } = useLoading(
		profileStore.uploadProfileAvatar
	)

	const { execute: deleteAvatar, isLoading: isDeleting } = useLoading(
		profileStore.deleteProfileAvatar
	)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setPreviewUrl(fileUrl)
		}
	}

	const handleSubmit = async () => {
		if (!checkAuth() || isLoading || isDeleting) return

		if (!file) {
			notificationStore.addErrorNotification('Выберите изображение!')
			return
		}
		const formData = new FormData()

		formData.append('avatarImg', file)

		const result = await updateAvatar(formData)

		notificationStore.addNotification({
			id: generateUUID(),
			text: result.message,
			isError: !result.status,
		})

		if (result.status) {
			setFile(null)
		}

		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
			setPreviewUrl(null)
		}
	}

	const handleDelete = async () => {
		if (!checkAuth() || isLoading || isDeleting) return

		const errors = await deleteAvatar()
		if (errors.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно удалили аватар!')
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	return (
		<EditProfilePageSection title='Аватар'>
			<div className='w-[144px]'>
				<div className='w-[250px]'>
					<SelectImageLabel htmlfor='avatar' />
				</div>

				<input
					onChange={handleFileChange}
					className='hidden'
					id='avatar'
					accept='image/*'
					type='file'
				/>
				<SelectedImageLabel file={file} className='mt-1' />
			</div>

			<div className='relative size-36 rounded-full overflow-hidden select-none'>
				<img
					alt='avatar'
					loading='lazy'
					decoding='async'
					src={
						previewUrl ||
						`${import.meta.env.VITE_SERVER_URL}/public/avatars/${
							profileStore.profile?.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: profileStore.profile?.avatar
						}`
					}
					className='aspect-square object-cover size-full'
				/>
			</div>

			<div className='pt-6 border-t border-white/5 w-full'>
				<div className='flex justify-between'>
					<div className='w-38'>
						<FormButton
							title={isLoading ? 'Сохранение...' : 'Сохранить'}
							isInvert={true}
							onClick={handleSubmit}
							disabled={!file || isLoading || isDeleting}
							isLoading={isLoading}
						/>
					</div>

					<div className='w-42'>
						<FormButton
							title={isDeleting ? 'Удаление...' : 'Удалить аватар'}
							isInvert={false}
							onClick={handleDelete}
							disabled={
								profileStore.profile?.avatar === '' || isDeleting || isLoading
							}
							isLoading={isDeleting}
						/>
					</div>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UploadAvatarForm
