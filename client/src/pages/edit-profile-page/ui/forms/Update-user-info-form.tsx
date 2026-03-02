import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import { useUpdateUserMutation } from '../../../../hooks/mutations'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import { constraints } from '../../../../utils/constraints'
import EditProfilePageSection from '../Edit-profile-page-section'

const UpdateUserInfoForm = observer(() => {
	const { authStore } = useStore()
	const { checkAuth } = useAuth()

	/** STATES */
	const [email, setEmail] = useState<string>(authStore.user?.email ?? '')
	const [nickname, setNickname] = useState<string>(
		authStore.user?.nickname ?? '',
	)
	const [newPassword, setNewPassword] = useState<string>('')
	const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const { mutateAsync, isPending } = useUpdateUserMutation({
		onSettled: () => {
			setPassword('')
			setNewPassword('')
			setNewPasswordConfirm('')
		},
	})

	/**
	 * Check if there are any changes in the form
	 *
	 * @return {boolean} - True if there are changes, false otherwise
	 */
	const hasChanges = useMemo(() => {
		if (!authStore.user) return false

		return (
			email.trim() !== authStore.user.email ||
			nickname.trim() !== authStore.user.nickname ||
			newPassword.trim() !== ''
		)
	}, [email, nickname, newPassword, authStore.user])

	/**
	 * Check if the form is valid
	 *
	 * @return {boolean} - True if the form is valid, false otherwise
	 */
	const isFormValid = useMemo(() => {
		return (
			email.trim().length > constraints.user.minEmailLength &&
			nickname.trim().length >= constraints.user.minNicknameLength &&
			nickname.trim().length <= constraints.user.maxNicknameLength &&
			(newPassword === '' ||
				(newPassword.length >= constraints.user.minPasswordLength &&
					newPassword === newPasswordConfirm)) &&
			password.length >= constraints.user.minPasswordLength
		)
	}, [email, nickname, newPassword, newPasswordConfirm, password])

	/**
	 * Handle form submission
	 */
	const handleSubmit = async () => {
		if (
			!checkAuth() ||
			!isFormValid ||
			!hasChanges ||
			!authStore.user ||
			isPending
		)
			return

		const data = {
			email: email.trim() === authStore.user.email ? undefined : email.trim(),
			nickname:
				nickname.trim() === authStore.user.nickname
					? undefined
					: nickname.trim(),
			newPassword: newPassword.trim() === '' ? undefined : newPassword.trim(),
			password,
		}
		return mutateAsync(data)
	}

	return (
		<EditProfilePageSection
			title='Данные аккаунта'
			description='Здесь Вы изменить данные своего аккаунта.'
		>
			<div className='grid gap-3 lg:gap-5'>
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

				<div className='pt-3 lg:pt-6 border-t border-white/5 w-full'>
					<div className='w-full sm:w-38'>
						<FormButton
							title={isPending ? 'Сохранение...' : 'Сохранить'}
							isInvert={true}
							onClick={handleSubmit}
							disabled={!isFormValid || !hasChanges || isPending}
							isLoading={isPending}
						/>
					</div>
				</div>
			</div>
		</EditProfilePageSection>
	)
})

export default UpdateUserInfoForm
