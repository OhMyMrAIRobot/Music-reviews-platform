import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
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

	const { execute: updateBio, isLoading } = useLoading(
		profileStore.updateProfileBio
	)

	const handleSubmit = async () => {
		if (!checkAuth() || isLoading) return

		const errors = await updateBio(bio)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Описание профиля успешно обновлено!'
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
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
						title={isLoading ? 'Сохранение...' : 'Сохранить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={bio === profileStore.profile?.bio || isLoading}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UpdateProfileInfoForm
