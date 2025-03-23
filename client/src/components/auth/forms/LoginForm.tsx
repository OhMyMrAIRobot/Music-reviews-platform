import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import UseCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useLoading } from '../../../hooks/UseLoading'
import { UseStore } from '../../../hooks/UseStore'
import AuthButton from '../components/AuthButton'
import AuthError from '../components/AuthError'
import AuthInput from '../components/AuthInput'
import AuthLabel from '../components/AuthLabel'
import AuthSubTitle from '../components/AuthSubTitle'
import AuthTitle from '../components/AuthTitle'

const LoginForm = observer(() => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const { navigateToMain, navigateToRegistration, navigateToRequestReset } =
		UseCustomNavigate()

	const { authStore } = UseStore()

	const { execute: login, isLoading } = useLoading(authStore.login)

	useEffect(() => {
		authStore.setErrors([])
	}, [authStore])

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
					<AuthButton
						title={isLoading ? 'Загрузка...' : 'Войти'}
						onClick={() => {
							login(email, password).then(() => {
								if (authStore.isAuth) {
									navigateToMain()
								}
							})
						}}
						isInvert={true}
					/>
					<AuthButton
						title={'Зарегистрироваться'}
						onClick={navigateToRegistration}
						isInvert={false}
					/>
				</div>
				{authStore.errors && (
					<div className='grid gap-2'>
						{authStore.errors.map(error => (
							<AuthError key={error} text={error} />
						))}
					</div>
				)}
			</div>
		</div>
	)
})

export default LoginForm
