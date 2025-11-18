import { useMutation, useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { SocialMediaAPI } from '../../../../api/social-media-api'
import FormInputWithConfirmation from '../../../../components/form-elements/Form-input-with-confirmation'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../hooks/use-auth'
import { useSocialMeta } from '../../../../hooks/use-social-meta'
import { useStore } from '../../../../hooks/use-store'
import { ISocialMedia } from '../../../../models/social-media/social-media'
import { profileKeys } from '../../../../query-keys/profile-keys'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileSocialsForm = observer(() => {
	const { authStore, notificationStore } = useStore()

	const { checkAuth } = useAuth()

	const { socials, isLoading } = useSocialMeta()

	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	const toggleMutation = useMutation({
		mutationFn: async ({
			socialId,
			value,
			initValue,
		}: {
			socialId: string
			value: string
			initValue: string
		}) => {
			if (value === '' && initValue !== '') {
				return SocialMediaAPI.deleteSocial(socialId)
			} else if (value !== '' && initValue === '') {
				return SocialMediaAPI.addSocial(socialId, value)
			} else if (value !== '' && initValue !== '') {
				return SocialMediaAPI.editSocial(socialId, value)
			}
		},
		onSuccess: (_, { socialId }) => {
			const social = socials.find(s => s.id === socialId)
			const userId = authStore.user?.id
			if (userId) {
				queryClient.invalidateQueries({ queryKey: profileKeys.profile(userId) })
			}
			notificationStore.addSuccessNotification(
				`Вы успешно обновили информацию о ${social?.name || 'социальной сети'}`
			)
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при обновлении социальной сети!')
		},
	})

	const handleClick = async (
		value: string,
		initValue: string,
		social: ISocialMedia
	) => {
		if (!checkAuth() || !authStore.user || toggleMutation.isPending) return

		toggleMutation.mutate({ socialId: social.id, value, initValue })
	}

	return (
		<EditProfilePageSection
			title='Социальные сети'
			description='Здесь Вы можете указать ссылки на свои социальные сети.'
		>
			<div className='grid gap-3'>
				{isLoading
					? Array.from({ length: 4 }).map((_, idx) => (
							<SkeletonLoader
								key={`Social-inputs-skeleton-${idx}`}
								className='w-full h-10 rounded-md'
							/>
					  ))
					: socials.map(social => {
							const initialValue =
								authStore.profile?.social.find(el => el.id === social.id)
									?.url ?? ''
							return (
								<FormInputWithConfirmation
									key={social.id}
									label={social.name}
									initialValue={initialValue}
									onClick={value => handleClick(value, initialValue, social)}
									isLoading={toggleMutation.isPending}
								/>
							)
					  })}
			</div>
		</EditProfilePageSection>
	)
})

export default UpdateProfileSocialsForm
