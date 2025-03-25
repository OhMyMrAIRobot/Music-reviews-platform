import { useEffect } from 'react'
import { useParams } from 'react-router'
import UseCustomNavigate from '../../../hooks/UseCustomNavigate'
import { UseStore } from '../../../hooks/UseStore'
import AuthInfoContainer from '../components/AuthInfoContainer'
import AuthInfoField from '../components/AuthInfoField'
import AuthTitle from '../components/AuthTitle'

const ActivationForm = () => {
	const { token } = useParams()
	const { notificationsStore, authStore } = UseStore()
	const { navigateToMain } = UseCustomNavigate()

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
			<AuthTitle title={'Активация аккаунта'} />
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
