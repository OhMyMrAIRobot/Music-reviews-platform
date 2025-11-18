import { useMutation, useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ProfileAPI } from '../../../../api/user/profile-api'
import FormButton from '../../../../components/form-elements/Form-button'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../components/form-elements/Form-textbox'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import { profileKeys } from '../../../../query-keys/profile-keys'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileInfoForm = observer(() => {
	const { authStore, notificationStore } = useStore()

	const { checkAuth } = useAuth()

	const [bio, setBio] = useState<string>(authStore.profile?.bio ?? '')

	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	const updateMutation = useMutation({
		mutationFn: (bio: string) => ProfileAPI.updateProfile({ bio }),
		onSuccess: () => {
			const userId = authStore.user?.id
			if (userId) {
				queryClient.invalidateQueries({ queryKey: profileKeys.profile(userId) })
			}
			notificationStore.addSuccessNotification(
				'Описание профиля успешно обновлено!'
			)
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при обновлении описания профиля!')
		},
	})

	const handleSubmit = async () => {
		if (!checkAuth() || updateMutation.isPending) return

		updateMutation.mutate(bio)
	}

	return (
		<EditProfilePageSection
			title='Данные профиля'
			description='Здесь Вы можете обновить данные своего профиля.'
		>
			<div className='flex flex-col gap-4'>
				<div className='grid gap-3'>
					<FormLabel
						name={'Описание профиля'}
						htmlFor={'bio'}
						isRequired={false}
					/>
					<FormTextbox
						id={'bio'}
						placeholder={'Описание профиля'}
						value={bio}
						setValue={setBio}
						className='h-30'
					/>
				</div>
			</div>

			<div className='pt-3 lg:pt-6 border-t border-white/5 w-full'>
				<div className='w-full sm:w-38'>
					<FormButton
						title={updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={
							bio === authStore.profile?.bio || updateMutation.isPending
						}
						isLoading={updateMutation.isPending}
					/>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UpdateProfileInfoForm
