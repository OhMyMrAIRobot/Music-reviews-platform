import { useMutation } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { ProfileAPI } from '../../../../api/user/profile-api'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../components/form-elements/Form-textbox'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../hooks/use-auth'
import { useSocialMeta } from '../../../../hooks/use-social-meta'
import { useStore } from '../../../../hooks/use-store'
import { UpdateProfileData } from '../../../../types/profile'
import buildProfileFormData from '../../../../utils/build-profile-form-data'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileInfoForm = observer(() => {
	const { authStore, notificationStore } = useStore()

	const { checkAuth } = useAuth()
	const { socials, isLoading } = useSocialMeta()

	const [bio, setBio] = useState<string>(authStore.profile?.bio ?? '')

	const [socialValues, setSocialValues] = useState<Record<string, string>>({})
	const [initialSocialValues, setInitialSocialValues] = useState<
		Record<string, string>
	>({})

	// const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	const updateMutation = useMutation({
		mutationFn: (formData: FormData) => ProfileAPI.update(formData),
		onSuccess: () => {
			const userId = authStore.user?.id
			if (userId) {
				// queryClient.invalidateQueries({ queryKey: profileKeys.profile(userId) })
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

		const changedSocials = socials
			.map(s => {
				const url = (socialValues[s.id] ?? '').trim()
				const initial = (initialSocialValues[s.id] ?? '').trim()
				if (url === initial) return null
				if (url === '') return { socialId: s.id }
				return { socialId: s.id, url }
			})
			.filter(
				(item): item is { socialId: string; url?: string } => item !== null
			)

		const payload: UpdateProfileData = {
			bio: bio !== authStore.profile?.bio ? bio : undefined,
		}
		if (changedSocials.length > 0) payload.socials = changedSocials

		const formData = buildProfileFormData(payload)

		updateMutation.mutate(formData)
	}

	useEffect(() => {
		if (socials && socials.length > 0) {
			const map: Record<string, string> = {}
			socials.forEach(s => {
				const initial =
					authStore.profile?.socials.find(el => el.id === s.id)?.url ?? ''
				map[s.id] = initial
			})
			setSocialValues(map)
			setInitialSocialValues(map)
		}
	}, [socials, authStore.profile])

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

			<div className='grid gap-3'>
				<FormLabel name={'Социальные сети'} htmlFor={''} isRequired={false} />
				{isLoading
					? Array.from({ length: 4 }).map((_, idx) => (
							<SkeletonLoader
								key={`Social-inputs-skeleton-${idx}`}
								className='w-full h-10 rounded-md'
							/>
					  ))
					: socials.map(social => (
							<FormInput
								id={`social-input-${social.id}`}
								key={social.id}
								placeholder={social.name}
								type='url'
								value={socialValues[social.id] ?? ''}
								setValue={(val: string) =>
									setSocialValues(prev => ({ ...prev, [social.id]: val }))
								}
							/>
					  ))}
			</div>
			<div className='pt-3 lg:pt-6 border-t border-white/5 w-full'>
				<div className='w-full sm:w-38'>
					<FormButton
						title={updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={
							(bio === (authStore.profile?.bio || '') &&
								!socials.some(
									s =>
										(socialValues[s.id] ?? '').trim() !==
										(initialSocialValues[s.id] ?? '').trim()
								)) ||
							updateMutation.isPending
						}
						isLoading={updateMutation.isPending}
					/>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UpdateProfileInfoForm
