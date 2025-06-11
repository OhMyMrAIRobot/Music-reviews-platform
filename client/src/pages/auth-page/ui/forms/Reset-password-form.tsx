import { useState } from 'react'
import { useParams } from 'react-router'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { IResetPasswordRequest } from '../../../../model/auth/request/reset-password-request'

const ResetPasswordForm = () => {
	const { token } = useParams()

	const { authStore, notificationsStore } = useStore()

	const { navigateToMain } = useCustomNavigate()

	const [formData, setFormData] = useState<IResetPasswordRequest>({
		password: '',
		passwordConfirm: '',
	})
	const [errors, setErrors] = useState<string[]>([])

	const { execute: reset, isLoading } = useLoading(authStore.resetPassword)

	const onSubmit = () => {
		reset(formData, token).then(errors => {
			setErrors(errors)
			if (errors.length === 0) {
				notificationsStore.addSuccessNotification(
					'Ваш пароль был успешно сброшен!'
				)
				navigateToMain()
			}
		})
	}

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

			{renderInput('password', 'Новый пароль', 'password')}
			{renderInput('passwordConfirm', 'Подтвердите пароль', 'password')}

			<FormButton
				title={isLoading ? 'Сброс пароля...' : 'Сбросить пароль'}
				onClick={onSubmit}
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
