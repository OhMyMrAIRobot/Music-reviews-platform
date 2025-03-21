import { useState } from 'react'
import AuthButton from './AuthButton'
import AuthInput from './AuthInput'
import AuthLabel from './AuthLabel'

const ReqResetPasswordForm = () => {
	const [email, setEmail] = useState<string>('')

	return (
		<div className='grid w-[330px] gap-4'>
			<div className='grid gap-0.5'>
				<h2 className='text-xl font-semibold'>Забыли пароль?</h2>
				<p className='text-sm text-white/50'>
					Введите ваш адрес электронной почты для восстановления пароля
				</p>
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
				title={'Сбросить пароль'}
				onClick={() => {}}
				isInvert={true}
			/>
		</div>
	)
}

export default ReqResetPasswordForm
