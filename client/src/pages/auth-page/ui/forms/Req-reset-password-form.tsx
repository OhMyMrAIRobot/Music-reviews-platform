import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { generateUUID } from '../../../../utils/generate-uuid'

const ReqResetPasswordForm = observer(() => {
	const { authStore, notificationStore } = useStore()

	const [email, setEmail] = useState<string>('')

	const { execute: sendRequest, isLoading } = useLoading(
		authStore.sendReqResetPassword
	)

	const onSubmit = async () => {
		if (isLoading || !email.trim()) return
		const result = await sendRequest(email)
		if (Array.isArray(result)) {
			result.forEach(err => notificationStore.addErrorNotification(err))
		} else {
			notificationStore.addNotification({
				id: generateUUID(),
				text: result
					? 'Письмо с инструкциями по восстановлению пароля отправлено на вашу почту!'
					: 'Ошибка при отправке письма. Повторите попытку позже!',
				isError: !result,
			})
			if (result) {
				setEmail('')
			}
		}
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
				disabled={isLoading || !email.trim()}
				isLoading={isLoading}
			/>
		</div>
	)
})

export default ReqResetPasswordForm
