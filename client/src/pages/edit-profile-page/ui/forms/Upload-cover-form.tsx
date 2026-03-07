import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import { useUpdateProfileMutation } from '../../../../hooks/mutations'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import buildProfileFormData from '../../../../utils/build-profile-form-data'
import EditProfilePageSection from '../Edit-profile-page-section'
import SelectImageLabel from '../labels/Select-image-label'
import SelectedImageLabel from '../labels/Selected-image-label'

const UploadCoverForm = observer(() => {
	const { authStore, notificationStore } = useStore()
	const { checkAuth } = useAuth()

	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	/**
	 * Function to handle file input change
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the file input
	 */
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setPreviewUrl(fileUrl)
		}
	}

	const onSuccess = () => {
		setFile(null)
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
			setPreviewUrl(null)
		}
	}

	/**
	 * Upload cover mutation
	 */
	const { mutateAsync: uploadAsync, isPending: isUploading } =
		useUpdateProfileMutation({ onSuccess })

	/**
	 * Delete cover mutation
	 */
	const { mutateAsync: deleteAsync, isPending: isDeleting } =
		useUpdateProfileMutation({ onSuccess })

	/**
	 * Indicates if any mutation is in progress
	 *
	 * @returns {boolean} True if any mutation is pending, false otherwise
	 */
	const isPending = useMemo(
		() => isUploading || isDeleting,
		[isUploading, isDeleting],
	)

	/**
	 * Function to handle form submission for uploading cover
	 */
	const handleSubmit = async () => {
		if (!checkAuth() || isPending) return

		if (!file) {
			notificationStore.addErrorNotification('Выберите изображение!')
			return
		}

		const formData = buildProfileFormData({ cover: file })

		return uploadAsync(formData)
	}

	/**
	 * Function to handle cover deletion
	 */
	const handleDelete = async () => {
		if (!checkAuth() || isPending) return
		const formData = buildProfileFormData({ clearCover: true })
		return deleteAsync(formData)
	}

	return (
		<EditProfilePageSection title='Обложка профиля'>
			<div className='w-full sm:w-[250px]'>
				<div className='w-full'>
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
							authStore.profile?.cover === ''
								? import.meta.env.VITE_DEFAULT_COVER
								: authStore.profile?.cover
						}`
					}
					className='object-cover size-full'
				/>
			</div>

			<div className='pt-3 lg:pt-6 border-t border-white/5 w-full'>
				<div className='grid grid-cols-1 sm:flex justify-between gap-2 w-full'>
					<div className='w-full sm:w-38'>
						<FormButton
							title={isUploading ? 'Сохранение...' : 'Сохранить'}
							isInvert={true}
							onClick={handleSubmit}
							disabled={!file || isPending}
							isLoading={isUploading}
						/>
					</div>

					<div className='w-full sm:w-42'>
						<FormButton
							title={isDeleting ? 'Удаление...' : 'Удалить обложку'}
							isInvert={false}
							onClick={handleDelete}
							disabled={authStore.profile?.cover === '' || isPending}
							isLoading={isDeleting}
						/>
					</div>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UploadCoverForm
