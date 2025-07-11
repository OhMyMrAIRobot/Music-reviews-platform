import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../components/form-elements/Form-textbox'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import notificationStore from '../../../../stores/notification-store'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileInfoForm = observer(() => {
	const { profileStore } = useStore()

	const { checkAuth } = useAuth()

	const [bio, setBio] = useState<string>(profileStore.profile?.bio ?? '')
	const [errors, setErrors] = useState<string[]>([])

	const { execute: updateBio, isLoading } = useLoading(
		profileStore.updateProfileBio
	)

	const handleSubmit = () => {
		setErrors([])
		if (!checkAuth()) return

		updateBio(bio).then(errors => {
			setErrors(errors)
			if (errors.length === 0) {
				notificationStore.addNotification({
					id: self.crypto.randomUUID(),
					text: 'Описание профиля успешно обновлено!',
					isError: false,
				})
			}
		})
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
					/>
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
			</div>

			<div className='pt-6 border-t border-white/5 w-full'>
				<div className='w-38'>
					<FormButton
						title={isLoading ? 'Сохранение...' : 'Сохранить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={bio === profileStore.profile?.bio || isLoading}
					/>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UpdateProfileInfoForm
