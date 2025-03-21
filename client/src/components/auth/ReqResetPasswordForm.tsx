import { useState } from 'react'
import AuthButton from './AuthButton'
import AuthInput from './AuthInput'
import AuthLabel from './AuthLabel'
import AuthSubTitle from './AuthSubTitle'
import AuthTitle from './AuthTitle'

const ReqResetPasswordForm = () => {
	const [email, setEmail] = useState<string>('')

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
				title={'Отправить письмо для сброса'}
				onClick={() => {}}
				isInvert={true}
			/>
		</div>
	)
}

export default ReqResetPasswordForm
