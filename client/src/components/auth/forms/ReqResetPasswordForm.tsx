import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import AuthButton from '../components/AuthButton'
import AuthInfoContainer from '../components/AuthInfoContainer'
import AuthInfoField from '../components/AuthInfoField'
import AuthInput from '../components/AuthInput'
import AuthLabel from '../components/AuthLabel'
import AuthSubTitle from '../components/AuthSubTitle'
import AuthTitle from '../components/AuthTitle'

const ReqResetPasswordForm = observer(() => {
	const [email, setEmail] = useState<string>('')
	const { authStore, notificationsStore } = useStore()
	const { execute: sendRequest, isLoading } = useLoading(
		authStore.sendReqResetPassword
	)

	useEffect(() => {
		authStore.setErrors([])
	}, [])

	return (
		<div className='grid w-[330px] gap-4'>
			<div className='grid gap-1'>
				<AuthTitle title={'Забыли пароль?'} />
				<AuthSubTitle
					title={
						'Введите ваш адрес электронной почты для восстановления пароля'
					}
				/>
			</div>
			<div className='grid gap-2'>
				<AuthLabel name={'Email'} htmlFor={'email'} />
				<AuthInput
					id={'email'}
					placeholder={'mail@example.com'}
					type={'email'}
					value={email}
					setValue={setEmail}
				/>
			</div>
			<AuthButton
				title={isLoading ? 'Отправка...' : 'Отправить письмо для сброса'}
				onClick={() => {
					sendRequest(email).then(result => {
						if (result !== null) {
							notificationsStore.addEmailSentNotification(result)
						}
					})
				}}
				isInvert={true}
			/>
			{authStore.errors && (
				<AuthInfoContainer>
					{authStore.errors.map(error => (
						<AuthInfoField key={error} text={error} isError={true} />
					))}
				</AuthInfoContainer>
			)}
		</div>
	)
})

export default ReqResetPasswordForm
