import { useEffect, useState } from 'react'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormInputWithConfirmation from '../../../../components/form-elements/Form-input-with-confirmation'
import SkeletonLoader from '../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileSocialsForm = () => {
	const { profileStore, authStore, notificationStore, metaStore } = useStore()

	const { execute: fetchSocials, isLoading } = useLoading(
		metaStore.fetchSocials
	)

	const [errors, setErrors] = useState<string[]>([])

	const { execute: toggle, isLoading: isToggleLoading } = useLoading(
		profileStore.toggleSocial
	)

	useEffect(() => {
		if (metaStore.socials.length === 0) {
			fetchSocials()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
									onClick={value => {
										setErrors([])
										toggle(
											social.id,
											value,
											initialValue,
											authStore.user?.id ?? ''
										).then(result => {
											setErrors(result)
											notificationStore.addSuccessNotification(
												`Вы успешно обновили информацию о ${social.name}`
											)
										})
									}}
									isLoading={isToggleLoading}
								/>
							)
					  })}
			</div>

			<div className='w-full lg:w-1/2'>
				{errors && (
					<FormInfoContainer>
						{errors.map(error => (
							<FormInfoField key={error} text={error} isError={true} />
						))}
					</FormInfoContainer>
				)}
			</div>
		</EditProfilePageSection>
	)
}

export default UpdateProfileSocialsForm
