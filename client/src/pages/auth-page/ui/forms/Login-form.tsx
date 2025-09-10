import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormSubTitle from '../../../../components/form-elements/Form-subtitle'
import FormTitle from '../../../../components/form-elements/Form-title'
import PreventableLink from '../../../../components/utils/Preventable-link'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'

const LoginForm = observer(() => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const { navigateToRegistration, navigateToRequestReset } = useNavigationPath()

	const { authStore, notificationStore } = useStore()

	const { execute: login, isLoading } = useLoading(authStore.login)

	const handleLogin = async () => {
		if (!email.trim() || !password || isLoading) return

		const errors = await login(email, password)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification('Вы успешно вошли!')
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	return (
		<div className='grid w-full sm:w-[350px] gap-6'>
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

						<PreventableLink
							to={navigateToRequestReset}
							prevent={isLoading}
							className={`text-sm cursor-pointer font-bold hover:underline underline-offset-4 ${
								isLoading ? 'opacity-50' : ''
							}`}
						>
							Забыли пароль?
						</PreventableLink>
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
						disabled={isLoading || !email.trim() || !password}
						isLoading={isLoading}
					/>

					<PreventableLink to={navigateToRegistration} prevent={isLoading}>
						<FormButton
							title={'Зарегистрироваться'}
							isInvert={false}
							disabled={isLoading}
						/>
					</PreventableLink>
				</div>
			</div>
		</div>
	)
})

export default LoginForm
