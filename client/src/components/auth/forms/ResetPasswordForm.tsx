import { useState } from 'react'
import { useParams } from 'react-router'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import { IResetPasswordData } from '../../../models/auth/ResetPasswordData'
import FormButton from '../../form-elements/Form-button'
import FormInfoContainer from '../../form-elements/Form-info-container'
import FormInfoField from '../../form-elements/Form-info-field'
import FormInput from '../../form-elements/Form-input'
import FormLabel from '../../form-elements/Form-label'
import FormSubTitle from '../../form-elements/Form-subtitle'
import FormTitle from '../../form-elements/Form-title'

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
			<FormLabel name={label} htmlFor={id} />
			{description && (
				<h3 className='text-sm font-medium text-white/50 select-none'>
					{description}
				</h3>
			)}
			<FormInput
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
				<FormTitle title={'Сброс пароля'} />
				<FormSubTitle title={'Введите новый пароль для аккаунта'} />
			</div>
			{renderInput('password', 'Пароль', 'password')}
			{renderInput('passwordConfirm', 'Подтвердите пароль', 'password')}
			<FormButton
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
				<FormInfoContainer>
					{errors.map(error => (
						<FormInfoField key={error} text={error} isError={true} />
					))}
				</FormInfoContainer>
			)}
		</div>
	)
}

export default ResetPasswordForm
