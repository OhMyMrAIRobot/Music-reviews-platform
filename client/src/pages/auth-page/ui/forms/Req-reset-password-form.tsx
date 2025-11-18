import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthAPI } from '../../../../api/auth-api'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useStore } from '../../../../hooks/use-store'
import { generateUUID } from '../../../../utils/generate-uuid'

const ReqResetPasswordForm = () => {
	const { notificationStore } = useStore()

	const [email, setEmail] = useState<string>('')

	const handleApiError = useApiErrorHandler()

	const { mutateAsync: sendRequest, isPending: isLoading } = useMutation({
		mutationFn: (email: string) => AuthAPI.reqResetPassword(email),
		onSuccess: data => {
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
					text: 'Ошибка при отправке письма. Повторите попытку позже!',
					isError: true,
				})
			}
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при отправке письма!')
		},
	})

	const onSubmit = async () => {
		if (isLoading || !email.trim()) return
		await sendRequest(email.trim())
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
				title={isLoading ? 'Отправка...' : 'Отправить письмо для сброса'}
				onClick={onSubmit}
				isInvert={true}
				disabled={isLoading || !email.trim()}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default ReqResetPasswordForm
