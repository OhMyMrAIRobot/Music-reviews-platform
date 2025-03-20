import { useState } from 'react'
import AuthButton from './AuthButton'
import AuthInput from './AuthInput'
import AuthLabel from './AuthLabel'

const LoginForm = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	return (
		<div className='grid w-[350px] gap-6'>
			<div className='grid gap-2 text-center'>
				<h2 className='text-3xl font-bold select-none'>Вход</h2>
				<p className='text-balance text-white/50 select-none'>
					Введите свои данные для входа в аккаунт
				</p>
			</div>
			<div className='grid gap-3'>
				<div className='grid gap-2'>
					<AuthLabel name={'Email'} htmlFor={'AuthEmail'} />
					<AuthInput
						id={'AuthEmail'}
						placeholder={'Ваш email'}
						type={'email'}
						value={email}
						setValue={setEmail}
					/>
				</div>
				<div className='grid gap-2'>
					<div className='flex justify-between items-center select-none'>
						<AuthLabel name={'Пароль'} htmlFor={'AuthPassword'} />
						<a className='text-sm font-bold underline' href='/'>
							Забыли пароль?
						</a>
					</div>
					<AuthInput
						id={'AuthPassword'}
						placeholder={'Ваш пароль'}
						type={'password'}
						value={password}
						setValue={setPassword}
					/>
				</div>
				<div className='grid gap-2'>
					<AuthButton title={'Войти'} onClick={() => {}} isInvert={true} />
					<AuthButton
						title={'Зарегистрироваться'}
						onClick={() => {}}
						isInvert={false}
					/>
				</div>
			</div>
		</div>
	)
}

export default LoginForm
