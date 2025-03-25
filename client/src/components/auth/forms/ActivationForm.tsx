import { useEffect } from 'react'
import { useParams } from 'react-router'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import AuthButton from '../components/AuthButton'
import AuthInfoContainer from '../components/AuthInfoContainer'
import AuthInfoField from '../components/AuthInfoField'
import AuthSubTitle from '../components/AuthSubTitle'
import AuthTitle from '../components/AuthTitle'

const ActivationForm = () => {
	const { token } = useParams()
	const { notificationsStore, authStore } = useStore()
	const { navigateToMain } = useCustomNavigate()
	const { execute: resend, isLoading } = useLoading(authStore.resendActivation)

	useEffect(() => {
		if (token) {
			authStore.activate(token).then(() => {
				if (authStore.errors.length === 0) {
					notificationsStore.addNotification({
						id: self.crypto.randomUUID(),
						text: 'Аккаунт успешно активирован!',
						isError: false,
					})
					navigateToMain()
				}
			})
		}
	}, [])

	return (
		<div className='grid w-[350px] gap-6 text-center'>
			<div className='grid gap-2'>
				<AuthTitle title={'Активация аккаунта'} />
				{!authStore.isAuth && (
					<AuthSubTitle
						title={'Войдите в Ваш аккаунт для повторного запроса активации!'}
					/>
				)}
			</div>

			{authStore.user?.isActive && (
				<AuthInfoField text={'Ваш аккаунт уже активирован!'} isError={true} />
			)}

			{authStore.isAuth && !authStore.user?.isActive && (
				<AuthButton
					title={isLoading ? 'Отправка...' : 'Отправить письмо активации'}
					isInvert={true}
					onClick={() => {
						resend().then(result => {
							if (result !== null) {
								notificationsStore.addEmailSentNotification(result)
							}
						})
					}}
				/>
			)}
			{authStore.errors && (
				<AuthInfoContainer>
					{authStore.errors.map(error => (
						<AuthInfoField key={error} text={error} isError={true} />
					))}
				</AuthInfoContainer>
			)}
		</div>
	)
}

export default ActivationForm
