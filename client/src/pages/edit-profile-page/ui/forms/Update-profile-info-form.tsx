import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../components/form-elements/Form-textbox'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import EditProfileSubmitButton from '../buttons/Edit-profile-submit-button'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateProfileInfoForm = observer(() => {
	const { authStore } = useStore()
	const { checkAuth } = useAuth()

	const [email, setEmail] = useState<string>(authStore.user?.email ?? '')
	const [nickname, setNickname] = useState<string>(
		authStore.user?.nickname ?? ''
	)
	const [bio, setBio] = useState<string>(authStore.profile?.bio ?? '')

	const handleSubmit = () => {
		if (!checkAuth()) return
	}

	return (
		<EditProfilePageSection
			title='Обложка профиля'
			description='Вы можете обновить данные своего профиля'
		>
			<div className='flex flex-col gap-4'>
				<div className='grid gap-3'>
					<FormLabel name={'Email'} htmlFor={'email'} isRequired={false} />
					<FormInput
						id={'email'}
						placeholder={'Ваш email'}
						type={'email'}
						value={email}
						setValue={setEmail}
					/>
				</div>

				<div className='grid gap-3'>
					<FormLabel name={'Никнейм'} htmlFor={'nickname'} isRequired={false} />
					<FormInput
						id={'nickname'}
						placeholder={'Ваш никнейм'}
						type={'text'}
						value={nickname}
						setValue={setNickname}
					/>
				</div>

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
