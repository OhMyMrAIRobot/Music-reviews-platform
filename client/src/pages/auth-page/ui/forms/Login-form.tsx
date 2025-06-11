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

const LoginForm = observer(() => {
	const [errors, setErrors] = useState<string[]>([])
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const { navigateToMain, navigateToRegistration, navigateToRequestReset } =
		useCustomNavigate()

	const { authStore, notificationsStore } = useStore()

	const { execute: login, isLoading } = useLoading(authStore.login)

	useEffect(() => {
		if (authStore.isAuth) {
			navigateToMain()
		}
	}, [authStore.isAuth, navigateToMain])

	const handleLogin = () => {
		login(email, password).then(errors => {
			setErrors(errors)
			if (authStore.isAuth)
				notificationsStore.addNotification({
					id: self.crypto.randomUUID(),
					text: 'Вы успешно вошли!',
					isError: false,
				})
		})
	}

	return (
		<div className='grid w-[350px] gap-6'>
			<div className='grid gap-2 text-center'>
				<FormTitle title={'Вход'} />
				<FormSubTitle title={'Введите свои данные для входа в аккаунт'} />
			</div>

			<div className='grid gap-3'>
				<div className='grid gap-2'>
					<FormLabel name={'Email'} htmlFor={'AuthEmail'} />

					<FormInput
						id={'AuthEmail'}
						placeholder={'Ваш email'}
						type={'email'}
						value={email}
						setValue={setEmail}
					/>
				</div>

				<div className='grid gap-2'>
					<div className='flex justify-between items-center select-none'>
						<FormLabel name={'Пароль'} htmlFor={'AuthPassword'} />

						<button
							onClick={navigateToRequestReset}
							className='text-sm cursor-pointer font-bold hover:underline'
						>
							Забыли пароль?
						</button>
					</div>

					<FormInput
						id={'AuthPassword'}
						placeholder={'Ваш пароль'}
						type={'password'}
						value={password}
						setValue={setPassword}
					/>
				</div>

				<div className='grid gap-2'>
					<FormButton
						title={isLoading ? 'Загрузка...' : 'Войти'}
						onClick={handleLogin}
						isInvert={true}
					/>

					<FormButton
						title={'Зарегистрироваться'}
						onClick={navigateToRegistration}
						isInvert={false}
					/>
				</div>

				{errors && (
					<FormInfoContainer>
						{errors.map(error => (
							<FormInfoField key={error} text={error} isError={true} />
						))}
					</FormInfoContainer>
				)}
			</div>
		</div>
	)
})

export default LoginForm
