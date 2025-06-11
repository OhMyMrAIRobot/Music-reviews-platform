import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'

const ReqResetPasswordForm = observer(() => {
	const { authStore, notificationsStore } = useStore()

	const { navigateToMain } = useCustomNavigate()

	const [email, setEmail] = useState<string>('')
	const [errors, setErrors] = useState<string[]>([])

	const { execute: sendRequest, isLoading } = useLoading(
		authStore.sendReqResetPassword
	)

	useEffect(() => {
		if (authStore.isAuth) {
			navigateToMain()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onSubmit = () => {
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
	}

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
				onClick={onSubmit}
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
