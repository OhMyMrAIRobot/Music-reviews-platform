import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { IResetPasswordRequest } from '../../../../models/auth/request/reset-password-request'

const ResetPasswordForm = () => {
	const { token } = useParams()

	const { authStore, notificationStore } = useStore()

	const { navigateToMain } = useCustomNavigate()

	const [formData, setFormData] = useState<IResetPasswordRequest>({
		password: '',
		passwordConfirm: '',
	})

	const isFormValid = useMemo(() => {
		return (
			formData.password &&
			formData.passwordConfirm &&
			formData.password === formData.passwordConfirm
		)
	}, [formData])

	const { execute: reset, isLoading } = useLoading(authStore.resetPassword)

	const onSubmit = async () => {
		if (!isFormValid || isLoading) return

		const errors = await reset(formData, token)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Ваш пароль был успешно сброшен!'
			)
			navigateToMain()
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
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
				disabled={isLoading || !isFormValid}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default ResetPasswordForm
