import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { ProfileAPI } from '../../../../api/user/profile-api'
import FormButton from '../../../../components/form-elements/Form-button'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys'
import { leaderboardKeys } from '../../../../query-keys/leaderboard-keys'
import { profilesKeys } from '../../../../query-keys/profiles-keys'
import { releaseMediaKeys } from '../../../../query-keys/release-media-keys'
import { reviewsKeys } from '../../../../query-keys/reviews-keys'
import { usersKeys } from '../../../../query-keys/users-keys'
import buildProfileFormData from '../../../../utils/build-profile-form-data'
import EditProfilePageSection from '../Edit-profile-page-section'
import SelectImageLabel from '../labels/Select-image-label'
import SelectedImageLabel from '../labels/Selected-image-label'

const UploadAvatarForm = observer(() => {
	/** HOOKS */
	const { authStore, notificationStore } = useStore()
	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	/** STATES */
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

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = (userId: string) => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: profilesKeys.profile(userId) },
			{ queryKey: leaderboardKeys.all },
			{ queryKey: authorCommentsKeys.all },
			{ queryKey: authorCommentsKeys.all },
			{ queryKey: releaseMediaKeys.all },
			{ queryKey: reviewsKeys.all },
			{ queryKey: usersKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Upload avatar mutation
	 */
	const { mutateAsync: uploadAsync, isPending: isUploading } = useMutation({
		mutationFn: (formData: FormData) => ProfileAPI.update(formData),
		onSuccess: data => {
			authStore.setProfile(data)
			notificationStore.addSuccessNotification('Аватар успешно обновлён!')
			setFile(null)
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
				setPreviewUrl(null)
			}

			if (authStore.user?.id) {
				invalidateRelatedQueries(authStore.user.id)
			}
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при загрузке аватара!')
		},
	})

	/**
	 * Delete avatar mutation
	 */
	const { mutateAsync: deleteAsync, isPending: isDeleting } = useMutation({
		mutationFn: () => {
			const formData = buildProfileFormData({ clearAvatar: true })
			return ProfileAPI.update(formData)
		},
		onSuccess: data => {
			authStore.setProfile(data)
			notificationStore.addSuccessNotification('Аватар успешно удалён!')
			setFile(null)
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
				setPreviewUrl(null)
			}

			if (authStore.user?.id) {
				invalidateRelatedQueries(authStore.user.id)
			}
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при удалении аватара!')
		},
	})

	/**
	 * Indicates if any mutation is in progress
	 *
	 * @returns {boolean} True if any mutation is pending, false otherwise
	 */
	const isPending = useMemo(
		() => isUploading || isDeleting,
		[isUploading, isDeleting]
	)

	/**
	 * Handle form submission for uploading avatar
	 */
	const handleSubmit = async () => {
		if (!checkAuth() || isPending) return

		if (!file) {
			notificationStore.addErrorNotification('Выберите изображение!')
			return
		}
		const formData = buildProfileFormData({ avatar: file })

		return uploadAsync(formData)
	}

	/**
	 * Handle avatar deletion
	 */
	const handleDelete = async () => {
		if (!checkAuth() || isPending) return
		return deleteAsync()
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
							title={isUploading ? 'Сохранение...' : 'Сохранить'}
							isInvert={true}
							onClick={handleSubmit}
							disabled={!file || isPending}
							isLoading={isUploading}
						/>
					</div>

					<div className='w-full sm:w-42'>
						<FormButton
							title={isDeleting ? 'Удаление...' : 'Удалить аватар'}
							isInvert={false}
							onClick={handleDelete}
							disabled={authStore.profile?.avatar === '' || isPending}
							isLoading={isDeleting}
						/>
					</div>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UploadAvatarForm
