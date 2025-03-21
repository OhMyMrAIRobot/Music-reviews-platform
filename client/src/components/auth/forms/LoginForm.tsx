import { useState } from 'react'
import UseCustomNavigate from '../../../hooks/UseCustomNavigate'
import AuthButton from '../components/AuthButton'
import AuthInput from '../components/AuthInput'
import AuthLabel from '../components/AuthLabel'
import AuthSubTitle from '../components/AuthSubTitle'
import AuthTitle from '../components/AuthTitle'

const LoginForm = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const { navigateToRegistration, navigateToRequestReset } = UseCustomNavigate()

	return (
		<div className='grid w-[350px] gap-6'>
			<div className='grid gap-2 text-center'>
				<AuthTitle title={'Вход'} />
				<AuthSubTitle title={'Введите свои данные для входа в аккаунт'} />
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
						<button
							onClick={navigateToRequestReset}
							className='text-sm cursor-pointer font-bold underline'
						>
							Забыли пароль?
						</button>
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
						onClick={navigateToRegistration}
						isInvert={false}
					/>
				</div>
			</div>
		</div>
	)
}

export default LoginForm
