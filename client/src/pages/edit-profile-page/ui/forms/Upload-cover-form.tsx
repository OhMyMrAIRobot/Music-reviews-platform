import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
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

	const { execute: deleteCover, isLoading: isDeleting } = useLoading(
		profileStore.deleteProfileCover
	)

	const handleDelete = async () => {
		const errors = await deleteCover()
		if (errors.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно удалили обложку!')
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

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
		formData.append('coverImg', file)

		updateCover(formData).then(result => {
			notificationStore.addNotification({
				id: self.crypto.randomUUID(),
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
		})
	}

	return (
		<EditProfilePageSection title='Обложка профиля'>
			<div className='w-[144px] shrink-0'>
				<div className='w-[250px]'>
					<SelectImageLabel htmlfor='cover' />
				</div>

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
							profileStore.profile?.cover === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: profileStore.profile?.cover
						}`
					}
					className='object-cover size-full'
				/>
			</div>

			<div className='pt-6 border-t border-white/5 w-full'>
				<div className='flex justify-between'>
					<div className='w-38'>
						<FormButton
							title={isLoading ? 'Сохранение...' : 'Сохранить'}
							isInvert={true}
							onClick={handleSubmit}
							disabled={!file || isLoading}
						/>
					</div>

					<div className='w-42'>
						<FormButton
							title={isDeleting ? 'Удаление...' : 'Удалить обложку'}
							isInvert={false}
							onClick={handleDelete}
							disabled={profileStore.profile?.cover === '' || isDeleting}
						/>
					</div>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UploadCoverForm
