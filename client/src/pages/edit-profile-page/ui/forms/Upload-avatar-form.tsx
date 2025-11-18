import { useMutation, useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ProfileAPI } from '../../../../api/user/profile-api'
import FormButton from '../../../../components/form-elements/Form-button'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import { profileKeys } from '../../../../query-keys/profile-keys'
import EditProfilePageSection from '../Edit-profile-page-section'
import SelectImageLabel from '../labels/Select-image-label'
import SelectedImageLabel from '../labels/Selected-image-label'

const UploadAvatarForm = observer(() => {
	const { checkAuth } = useAuth()

	const { authStore, notificationStore } = useStore()

	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	const uploadMutation = useMutation({
		mutationFn: (formData: FormData) =>
			ProfileAPI.uploadProfileImages(formData),
		onSuccess: () => {
			const userId = authStore.user?.id
			if (userId) {
				queryClient.invalidateQueries({ queryKey: profileKeys.profile(userId) })
			}
			notificationStore.addSuccessNotification('Аватар успешно обновлён!')
			setFile(null)
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
				setPreviewUrl(null)
			}
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при загрузке аватара!')
		},
	})

	const deleteMutation = useMutation({
		mutationFn: () => ProfileAPI.updateProfile({ clearAvatar: true }),
		onSuccess: () => {
			const userId = authStore.user?.id
			if (userId) {
				queryClient.invalidateQueries({ queryKey: profileKeys.profile(userId) })
			}
			notificationStore.addSuccessNotification('Аватар успешно удалён!')
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при удалении аватара!')
		},
	})

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)

			const fileUrl = URL.createObjectURL(selectedFile)
			setPreviewUrl(fileUrl)
		}
	}

	const handleSubmit = async () => {
		if (!checkAuth() || uploadMutation.isPending || deleteMutation.isPending)
			return

		if (!file) {
			notificationStore.addErrorNotification('Выберите изображение!')
			return
		}
		const formData = new FormData()

		formData.append('avatarImg', file)

		uploadMutation.mutate(formData)
	}

	const handleDelete = async () => {
		if (!checkAuth() || uploadMutation.isPending || deleteMutation.isPending)
			return

		deleteMutation.mutate()
	}

	return (
		<EditProfilePageSection title='Аватар'>
			<div className='w-full sm:w-[250px]'>
				<div className='w-full'>
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
							authStore.profile?.avatar === ''
								? import.meta.env.VITE_DEFAULT_AVATAR
								: authStore.profile?.avatar
						}`
					}
					className='aspect-square object-cover size-full'
				/>
			</div>

			<div className='pt-3 lg:pt-6 border-t border-white/5 w-full'>
				<div className='grid grid-cols-1 sm:flex justify-between gap-2 w-full'>
					<div className='w-full sm:w-38'>
						<FormButton
							title={uploadMutation.isPending ? 'Сохранение...' : 'Сохранить'}
							isInvert={true}
							onClick={handleSubmit}
							disabled={
								!file || uploadMutation.isPending || deleteMutation.isPending
							}
							isLoading={uploadMutation.isPending}
						/>
					</div>

					<div className='w-full sm:w-42'>
						<FormButton
							title={
								deleteMutation.isPending ? 'Удаление...' : 'Удалить аватар'
							}
							isInvert={false}
							onClick={handleDelete}
							disabled={
								authStore.profile?.avatar === '' ||
								deleteMutation.isPending ||
								uploadMutation.isPending
							}
							isLoading={deleteMutation.isPending}
						/>
					</div>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UploadAvatarForm
