import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AuthAPI } from '../../../../api/auth-api'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { IResetPasswordRequest } from '../../../../models/auth/request/reset-password-request'

const ResetPasswordForm = () => {
	const { token } = useParams()

	const { authStore, notificationStore } = useStore()

	const navigate = useNavigate()

	const { navigateToMain } = useNavigationPath()

	const handleApiError = useApiErrorHandler()

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

	const { mutateAsync: reset, isPending: isLoading } = useMutation({
		mutationFn: ({ password, token }: { password: string; token: string }) =>
			AuthAPI.resetPassword(password, token),
		onSuccess: data => {
			const { user, accessToken } = data
			authStore.setAuthorization(user, accessToken)
			notificationStore.addSuccessNotification(
				'Ваш пароль был успешно сброшен!'
			)
			navigate(navigateToMain)
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при сбросе пароля!')
		},
	})

	const onSubmit = async () => {
		if (!isFormValid || isLoading) return

		if (formData.password !== formData.passwordConfirm) {
			notificationStore.addErrorNotification('Пароли не совпадают!')
			return
		}

		await reset({ password: formData.password, token: token! })
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
		<div className='grid gap-4 w-full sm:w-[330px]'>
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
