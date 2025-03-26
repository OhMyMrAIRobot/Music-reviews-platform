import { useState } from 'react'
import { useParams } from 'react-router'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import { IResetPasswordData } from '../../../models/auth/ResetPasswordData'
import AuthButton from '../components/AuthButton'
import AuthInfoContainer from '../components/AuthInfoContainer'
import AuthInfoField from '../components/AuthInfoField'
import AuthInput from '../components/AuthInput'
import AuthLabel from '../components/AuthLabel'
import AuthSubTitle from '../components/AuthSubTitle'
import AuthTitle from '../components/AuthTitle'

const ResetPasswordForm = () => {
	const [formData, setFormData] = useState<IResetPasswordData>({
		password: '',
		passwordConfirm: '',
	})
	const [errors, setErrors] = useState<string[]>([])
	const { authStore, notificationsStore } = useStore()
	const { token } = useParams()
	const { execute: reset, isLoading } = useLoading(authStore.resetPassword)
	const { navigateToMain } = useCustomNavigate()

	const handleChange = (
		field: keyof typeof formData,
		value: string | boolean
	) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const renderInput = (
		id: keyof typeof formData,
		label: string,
		type: string,
		placeholder?: string,
		description?: string
	) => (
		<div className='grid gap-1'>
			<AuthLabel name={label} htmlFor={id} />
			{description && (
				<h3 className='text-sm font-medium text-white/50 select-none'>
					{description}
				</h3>
			)}
			<AuthInput
				id={id}
				placeholder={placeholder || ''}
				type={type}
				value={formData[id] as string}
				setValue={value => handleChange(id, value)}
			/>
		</div>
	)

	return (
		<div className='grid gap-4 w-[330px]'>
			<div className='grid gap-1'>
				<AuthTitle title={'Сброс пароля'} />
				<AuthSubTitle title={'Введите новый пароль для аккаунта'} />
			</div>
			{renderInput('password', 'Пароль', 'password')}
			{renderInput('passwordConfirm', 'Подтвердите пароль', 'password')}
			<AuthButton
				title={isLoading ? 'Сброс...' : 'Сбросить пароль'}
				onClick={() =>
					reset(formData, token).then(errors => {
						setErrors(errors)
						if (errors.length === 0) {
							notificationsStore.addNotification({
								id: self.crypto.randomUUID(),
								text: 'Ваш пароль был успешно сброшен!',
								isError: false,
							})
							navigateToMain()
						}
					})
				}
				isInvert={true}
			/>

			{errors && (
				<AuthInfoContainer>
					{errors.map(error => (
						<AuthInfoField key={error} text={error} isError={true} />
					))}
				</AuthInfoContainer>
			)}
		</div>
	)
}

export default ResetPasswordForm
