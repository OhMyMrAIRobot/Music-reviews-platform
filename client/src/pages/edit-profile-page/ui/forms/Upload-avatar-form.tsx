import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import EditProfileSubmitButton from '../buttons/Edit-profile-submit-button'
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

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setPreviewUrl(fileUrl)
		}
	}

	const handleSubmit = () => {
		if (!checkAuth()) return

		if (!file) {
			notificationStore.addErrorNotification('Выберите изображение!')
			return
		}
		const formData = new FormData()

		formData.append('file', file)

		updateAvatar(formData).then(result => {
			notificationStore.addNotification({
				id: self.crypto.randomUUID(),
				text: result.message,
				isError: !result.status,
			})
			setFile(null)
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
				setPreviewUrl(null)
			}
		})
	}

	return (
		<EditProfilePageSection title='Аватар'>
			<div className='w-[144px]'>
				<SelectImageLabel htmlfor='avatar' />
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
							profileStore.profile?.avatar
						}`
					}
					className='aspect-square size-full'
				/>
			</div>

			<EditProfileSubmitButton
				handleClick={handleSubmit}
				disabled={!file || isLoading}
				isLoading={isLoading}
			/>
		</EditProfilePageSection>
	)
})

export default UploadAvatarForm
