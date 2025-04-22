import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { useStore } from '../../../hooks/UseStore'
import FormButton from '../../form/FormButton'
import FormInfoContainer from '../../form/FormInfoContainer'
import FormInfoField from '../../form/FormInfoField'
import FormInput from '../../form/FormInput'
import FormLabel from '../../form/FormLabel'
import FormSubTitle from '../../form/FormSubTitle'
import FormTitle from '../../form/FormTitle'

const ReqResetPasswordForm = observer(() => {
	const [email, setEmail] = useState<string>('')
	const [errors, setErrors] = useState<string[]>([])
	const { navigateToMain } = useCustomNavigate()
	const { authStore, notificationsStore } = useStore()
	const { execute: sendRequest, isLoading } = useLoading(
		authStore.sendReqResetPassword
	)

	useEffect(() => {
		if (authStore.isAuth) {
			navigateToMain()
		}
	}, [])

	return (
		<div className='grid w-[330px] gap-4'>
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
				onClick={() => {
					sendRequest(email).then(result => {
						if (Array.isArray(result)) {
							setErrors(result)
						} else {
							notificationsStore.addNotification({
								id: self.crypto.randomUUID(),
								text: result
									? 'Письмо с инструкциями по восстановлению пароля отправлено на вашу почту!'
									: 'Ошибка при отправке письма. Повторите попытку позже!',
								isError: !result,
							})
						}
					})
				}}
				isInvert={true}
			/>

			{errors && (
				<FormInfoContainer>
					{errors.map(error => (
						<FormInfoField key={error} text={error} isError={true} />
					))}
				</FormInfoContainer>
			)}
		</div>
	)
})

export default ReqResetPasswordForm
