import { useState } from 'react'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import EditProfilePageSection from '../Edit-profile-page-section'
import EditProfileSubmitButton from '../buttons/Edit-profile-submit-button'

const UpdateUserInfoForm = () => {
	const { authStore, notificationStore } = useStore()

	const [email, setEmail] = useState<string>(authStore.user?.email ?? '')
	const [nickname, setNickname] = useState<string>(
		authStore.user?.nickname ?? ''
	)
	const [newPassword, setNewPassword] = useState<string>('')
	const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const [errors, setErrors] = useState<string[]>([])

	const { execute: update, isLoading } = useLoading(authStore.updateUserData)

	const handleSubmit = () => {
		setErrors([])

		update(email, nickname, newPassword, newPasswordConfirm, password).then(
			result => {
				if (Array.isArray(result)) {
					setErrors(result)
				} else {
					notificationStore.addSuccessNotification(
						'Вы успешно обновили данные об аккаунте!'
					)
					if (result) {
						notificationStore.addEmailSentNotification(result)
					}
					setPassword('')
					setNewPassword('')
					setNewPasswordConfirm('')
				}
			}
		)
	}

	return (
		<EditProfilePageSection
			title='Данные аккаунта'
			description='Здесь Вы изменить данные своего аккаунта.'
		>
			<div className='grid gap-5'>
				<div className='grid gap-2'>
					<FormLabel name={'Email'} htmlFor={'EditEmail'} isRequired={false} />

					<FormInput
						id={'EditEmail'}
						placeholder={'Example@mail.com'}
						type={'email'}
						value={email}
						setValue={setEmail}
					/>
				</div>

				<div className='grid gap-2'>
					<FormLabel
						name={'Никнейм'}
						htmlFor={'EditNickname'}
						isRequired={false}
					/>

					<FormInput
						id={'EditNickname'}
						placeholder={'Никнейм'}
						type={'text'}
						value={nickname}
						setValue={setNickname}
					/>
				</div>

				<div className='grid gap-2'>
					<FormLabel
						name={'Новый пароль'}
						htmlFor={'EditPassword'}
						isRequired={false}
					/>

					<FormInput
						id={'EditPassword'}
						placeholder={'Пароль'}
						type={'password'}
						value={newPassword}
						setValue={setNewPassword}
					/>
				</div>

				<div className='grid gap-2'>
					<FormLabel
						name={'Подтвердите новый пароль'}
						htmlFor={'EditPasswordConfirm'}
						isRequired={false}
					/>

					<FormInput
						id={'EditPasswordConfirm'}
						placeholder={'Подтвердите новый пароль'}
						type={'password'}
						value={newPasswordConfirm}
						setValue={setNewPasswordConfirm}
					/>
				</div>

				<div className='border-t border-white/5 w-full' />

				<div className='grid gap-2'>
					<FormLabel
						name={'Текущий пароль'}
						htmlFor={'EditCurrentPassword'}
						isRequired={true}
					/>

					<FormInput
						id={'EditCurrentPassword'}
						placeholder={'Текущий пароль'}
						type={'password'}
						value={password}
						setValue={setPassword}
					/>
				</div>

				<EditProfileSubmitButton
					handleClick={handleSubmit}
					disabled={
						password.length < 6 ||
						isLoading ||
						email.length === 0 ||
						nickname.length === 0 ||
						newPassword !== newPasswordConfirm
					}
					isLoading={false}
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
		</EditProfilePageSection>
	)
}

export default UpdateUserInfoForm
