import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import FormButton from '../../form/FormButton'
import FormInfoContainer from '../../form/FormInfoContainer'
import FormInfoField from '../../form/FormInfoField'
import FormSubTitle from '../../form/FormSubTitle'
import FormTitle from '../../form/FormTitle'

const ActivationForm = () => {
	const [errors, setErrors] = useState<string[]>([])
	const { token } = useParams()
	const { notificationsStore, authStore } = useStore()
	const { navigateToMain } = useCustomNavigate()
	const { execute: resend, isLoading } = useLoading(authStore.resendActivation)

	useEffect(() => {
		if (token) {
			authStore.activate(token).then(errors => {
				if (errors.length === 0) {
					notificationsStore.addNotification({
						id: self.crypto.randomUUID(),
						text: 'Аккаунт успешно активирован!',
						isError: false,
					})
					navigateToMain()
				} else {
					setErrors(errors)
				}
			})
		}
	}, [])

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
					onClick={() => {
						resend().then(result => {
							if (Array.isArray(result)) {
								setErrors(result)
							} else {
								notificationsStore.addEmailSentNotification(result)
							}
						})
					}}
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
