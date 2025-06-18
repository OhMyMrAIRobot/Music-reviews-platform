import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import EditProfileSubmitButton from '../buttons/Edit-profile-submit-button'
import EditProfilePageSection from '../Edit-profile-page-section'
import SelectImageLabel from '../labels/Select-image-label'
import SelectedImageLabel from '../labels/Selected-image-label'

const UploadCoverForm = observer(() => {
	const { checkAuth } = useAuth()

	const { notificationStore, profileStore } = useStore()

	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const { execute: updateCover, isLoading } = useLoading(
		profileStore.uploadProfileCover
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

		updateCover(formData).then(result => {
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
		<EditProfilePageSection title='Обложка профиля'>
			<div className='w-[144px] shrink-0'>
				<SelectImageLabel htmlfor='cover' />
				<input
					onChange={handleFileChange}
					className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium hidden'
					id='cover'
					accept='image/*'
					type='file'
				/>
				<SelectedImageLabel file={file} className='mt-1' />
			</div>

			<div className='relative w-full max-h-28 sm:max-h-44 lg:max-h-64 rounded-lg overflow-hidden aspect-video select-none'>
				<img
					alt='cover'
					loading='lazy'
					decoding='async'
					src={
						previewUrl ||
						`${import.meta.env.VITE_SERVER_URL}/public/covers/${
							profileStore.profile?.cover
						}`
					}
					className='object-cover size-full'
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

export default UploadCoverForm
