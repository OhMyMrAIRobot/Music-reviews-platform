import { useEffect, useState } from 'react'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import EditProfilePageSection from '../Edit-profile-page-section'
import SocialMediaInput from '../inputs/Social-media-input'

const UpdateProfileSocialsForm = () => {
	const { profileStore } = useStore()

	const { execute: fetchSocials, isLoading } = useLoading(
		profileStore.fetchSocials
	)

	const [errors, setErrors] = useState<string[]>([])

	useEffect(() => {
		fetchSocials()
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
							<div
								key={`Social-inputs-skeleton-${idx}`}
								className='bg-gray-400 w-full h-10 animate-pulse opacity-40 rounded-md'
							/>
					  ))
					: profileStore.socials.map(social => (
							<SocialMediaInput
								key={social.id}
								social={social}
								initialValue={
									profileStore.profile?.social.find(el => el.id === social.id)
										?.url ?? ''
								}
								setErrors={setErrors}
							/>
					  ))}
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
