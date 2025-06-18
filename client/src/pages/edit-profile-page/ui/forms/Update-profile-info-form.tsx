import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../components/form-elements/Form-textbox'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import EditProfileSubmitButton from '../buttons/Edit-profile-submit-button'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileInfoForm = observer(() => {
	const { profileStore } = useStore()

	const { checkAuth } = useAuth()

	const [bio, setBio] = useState<string>(profileStore.profile?.bio ?? '')

	const handleSubmit = () => {
		if (!checkAuth()) return
	}

	return (
		<EditProfilePageSection
			title='Данные профиля'
			description='Вы можете обновить данные своего профиля'
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
			</div>
			<EditProfileSubmitButton
				handleClick={handleSubmit}
				disabled={true}
				isLoading={false}
			/>
		</EditProfilePageSection>
	)
})

export default UpdateProfileInfoForm
