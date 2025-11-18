import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AuthAPI } from '../../../../api/auth-api'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'

const ActivationForm = () => {
	const { token } = useParams()

	const { notificationStore, authStore } = useStore()

	const navigate = useNavigate()

	const { navigateToMain } = useNavigationPath()

	const handleApiError = useApiErrorHandler()

	const { mutateAsync: activate } = useMutation({
		mutationFn: (token: string) => AuthAPI.activate(token),
		onSuccess: data => {
			const { user, accessToken } = data
			authStore.setAuthorization(user, accessToken)
			notificationStore.addSuccessNotification('Аккаунт успешно активирован!')
			navigate(navigateToMain)
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при активации аккаунта!')
		},
	})

	const { mutateAsync: resend, isPending: isLoading } = useMutation({
		mutationFn: () => AuthAPI.resendActivation(),
		onSuccess: data => {
			if (data.emailSent) {
				notificationStore.addEmailSentNotification(data.emailSent)
			}
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Ошибка при отправке письма активации!')
		},
	})

	useEffect(() => {
		if (token) {
			activate(token)
		}
	}, [activate, token])

	return (
		<div className='grid w-full sm:w-[350px] gap-6 text-center'>
			<div className='grid gap-2'>
				<FormTitle title={'Активация аккаунта'} />
				{!authStore.isAuth && (
					<FormSubTitle
						title={'Войдите в Ваш аккаунт для повторного запроса активации!'}
					/>
				)}
			</div>

			{authStore.user?.isActive && !token && (
				<FormInfoField text={'Ваш аккаунт уже активирован!'} isError={true} />
			)}

			{authStore.isAuth && !authStore.user?.isActive && (
				<FormButton
					title={isLoading ? 'Отправка...' : 'Отправить письмо активации'}
					isInvert={true}
					onClick={resend}
					disabled={isLoading}
					isLoading={isLoading}
				/>
			)}
		</div>
	)
}

export default ActivationForm
