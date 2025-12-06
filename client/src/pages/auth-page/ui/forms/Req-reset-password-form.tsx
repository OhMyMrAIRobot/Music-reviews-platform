import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { AuthAPI } from '../../../../api/auth-api'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useStore } from '../../../../hooks/use-store'
import {
	AuthEmailSentStatusResponse,
	SendResetPasswordData,
} from '../../../../types/auth'
import { constraints } from '../../../../utils/constraints'
import { generateUUID } from '../../../../utils/generate-uuid'

const ReqResetPasswordForm = () => {
	/** HOOKS */
	const { notificationStore } = useStore()
	const handleApiError = useApiErrorHandler()

	/** STATES */
	const [email, setEmail] = useState<string>('')

	/**
	 * Mutation for sending the reset password request.
	 */
	const { mutateAsync: sendRequest, isPending: isLoading } = useMutation({
		mutationFn: (data: SendResetPasswordData) =>
			AuthAPI.sendResetPassword(data),
		onSuccess: data => hadleResponse(data),
		onError: (error: unknown) => {
			handleApiError(
				error,
				'Ошибка при отправке письма для восстановления пароля!'
			)
		},
	})

	/**
	 * Handles the response from the reset password request.
	 *
	 * @param data - The response data.
	 */
	const hadleResponse = (data: AuthEmailSentStatusResponse) => {
		if (data.emailSent) {
			notificationStore.addNotification({
				id: generateUUID(),
				text: 'Письмо с инструкциями по восстановлению пароля отправлено на вашу почту!',
				isError: false,
			})
			setEmail('')
		} else {
			notificationStore.addNotification({
				id: generateUUID(),
				text: 'Ошибка при отправке письма для восстановления пароля. Повторите попытку позже!',
				isError: true,
			})
		}
	}

	/**
	 * Indicates whether the form is valid.
	 *
	 * @returns {boolean} True if the form is valid, false otherwise.
	 */
	const isFormValid = useMemo(() => {
		return (
			email.trim().length > constraints.user.minEmailLength &&
			email.trim().length <= constraints.user.maxEmailLength
		)
	}, [email])

	/**
	 * Handles the form submission.
	 */
	const onSubmit = async () => {
		if (isLoading || !isFormValid) return

		return sendRequest({ email: email.trim() })
	}

	return (
		<div className='grid w-full sm:w-[330px] gap-4'>
			<div className='grid gap-1'>
				<FormTitle title={'Забыли пароль?'} />
				<FormSubTitle
					title={
						'Введите ваш адрес электронной почты для восстановления пароля'
					}
				/>
			</div>
			<div className='grid gap-2'>
				<FormLabel name={'Email'} htmlFor={'email'} />
				<FormInput
					id={'email'}
					placeholder={'mail@example.com'}
					type={'email'}
					value={email}
					setValue={setEmail}
				/>
			</div>

			<FormButton
				title={isLoading ? 'Отправка...' : 'Отправить письмо с инструкциями'}
				onClick={onSubmit}
				isInvert={true}
				disabled={isLoading || !isFormValid}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default ReqResetPasswordForm
