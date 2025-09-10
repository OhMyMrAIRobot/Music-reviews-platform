import { useEffect } from 'react'
import FormInputWithConfirmation from '../../../../components/form-elements/Form-input-with-confirmation'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { ISocialMedia } from '../../../../models/social-media/social-media'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileSocialsForm = () => {
	const { profileStore, authStore, notificationStore, metaStore } = useStore()

	const { checkAuth } = useAuth()

	const { execute: fetchSocials, isLoading } = useLoading(
		metaStore.fetchSocials
	)

	const { execute: toggle, isLoading: isToggleLoading } = useLoading(
		profileStore.toggleSocial
	)

	useEffect(() => {
		if (metaStore.socials.length === 0) {
			fetchSocials()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleClick = async (
		value: string,
		initValue: string,
		social: ISocialMedia
	) => {
		if (!checkAuth() || !authStore.user || isLoading) return
		const errors = await toggle(social.id, value, initValue, authStore.user.id)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				`Вы успешно обновили информацию о ${social.name}`
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
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
					: metaStore.socials.map(social => {
							const initialValue =
								profileStore.profile?.social.find(el => el.id === social.id)
									?.url ?? ''
							return (
								<FormInputWithConfirmation
									key={social.id}
									label={social.name}
									initialValue={initialValue}
									onClick={value => handleClick(value, initialValue, social)}
									isLoading={isToggleLoading}
								/>
							)
					  })}
			</div>
		</EditProfilePageSection>
	)
}

export default UpdateProfileSocialsForm
