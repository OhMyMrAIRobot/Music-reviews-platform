import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAuthCheck } from '../../hooks/UseAuthCheck'
import { useStore } from '../../hooks/UseStore'
import FormInput from '../form-elements/Form-input'
import FormLabel from '../form-elements/Form-label'
import FormTextbox from '../form-elements/FormTextbox'
import EditProfileSection from './EditProfileSection'
import SubmitButton from './SubmitButton'

const UpdateProfileInfoForm = observer(() => {
	const { profileStore, authStore } = useStore()
	const { checkAuth } = useAuthCheck()

	const [email, setEmail] = useState<string>(authStore.user?.email ?? '')
	const [nickname, setNickname] = useState<string>(
		authStore.user?.nickname ?? ''
	)
	const [bio, setBio] = useState<string>(profileStore.myProfile?.bio ?? '')

	const handleSubmit = () => {
		if (!checkAuth()) return
	}

	return (
		<EditProfileSection
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
			<SubmitButton onClick={handleSubmit} title='Отправить' />
		</EditProfileSection>
	)
})

export default UpdateProfileInfoForm
