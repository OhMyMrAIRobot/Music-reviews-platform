import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'

const ActivationForm = () => {
	const { token } = useParams()

	const { notificationStore: notificationsStore, authStore } = useStore()
	const { navigateToMain } = useCustomNavigate()

	const [errors, setErrors] = useState<string[]>([])

	const { execute: resend, isLoading } = useLoading(authStore.resendActivation)

	useEffect(() => {
		if (token) {
			authStore.activate(token).then(errors => {
				if (errors.length === 0) {
					notificationsStore.addSuccessNotification(
						'Аккаунт успешно активирован!'
					)
					navigateToMain()
				} else {
					setErrors(errors)
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleResend = () => {
		resend().then(result => {
			if (Array.isArray(result)) {
				setErrors(result)
			} else {
				notificationsStore.addEmailSentNotification(result)
			}
		})
	}

	return (
		<div className='grid w-[350px] gap-6 text-center'>
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
					onClick={handleResend}
				/>
			)}
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

export default ActivationForm
