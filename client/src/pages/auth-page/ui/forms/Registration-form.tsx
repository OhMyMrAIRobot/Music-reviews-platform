import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormCheckbox from '../../../../components/form-elements/Form-checkbox'
import FormInfoContainer from '../../../../components/form-elements/Form-info-container'
import FormInfoField from '../../../../components/form-elements/Form-info-field'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTitle from '../../../../components/form-elements/Form-title'
import useCustomNavigate from '../../../../hooks/use-custom-navigate'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import { IRegistrationRequest } from '../../../../models/auth/request/registration-request'

const RegistrationForm = observer(() => {
	const { authStore, notificationStore } = useStore()

	const { navigateToMain, navigateToLogin } = useCustomNavigate()

	const [formData, setFormData] = useState<IRegistrationRequest>({
		email: '',
		nickname: '',
		password: '',
		passwordConfirm: '',
		agreementChecked: false,
		policyChecked: false,
	})
	const [errors, setErrors] = useState<string[]>([])

	const { execute: register, isLoading } = useLoading(authStore.register)

	useEffect(() => {
		if (authStore.isAuth) {
			navigateToMain()
		}
	}, [authStore.isAuth, navigateToMain])

	const handleChange = (
		field: keyof typeof formData,
		value: string | boolean
	) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const renderInput = (
		id: keyof typeof formData,
		label: string,
		type: string,
		placeholder?: string,
		description?: string
	) => (
		<div className='grid gap-1'>
			<FormLabel name={label} htmlFor={id} />
			{description && (
				<h3 className='text-sm font-medium text-white/50 select-none'>
					{description}
				</h3>
			)}
			<FormInput
				id={id}
				placeholder={placeholder || ''}
				type={type}
				value={formData[id] as string}
				setValue={value => handleChange(id, value)}
			/>
		</div>
	)

	const renderCheckbox = (
		id: keyof typeof formData,
		linkText: string,
		linkHref: string
	) => (
		<div className='flex items-center space-x-2 select-none'>
			<FormCheckbox
				checked={formData[id] as boolean}
				setChecked={value => handleChange(id, value)}
			/>

			<span className='text-sm font-medium'>
				Принимаю условия
				<br />
				<a href={linkHref} className='underline underline-offset-2'>
					{linkText}
				</a>
				<span className='text-red-500 ml-1'>*</span>
			</span>
		</div>
	)

	const handleRegistration = () => {
		register(formData).then(result => {
			if (Array.isArray(result)) {
				setErrors(result)
			} else {
				notificationStore.addNotification({
					id: self.crypto.randomUUID(),
					text: 'Вы успешно зарегистрировались!',
					isError: false,
				})
				notificationStore.addEmailSentNotification(result)
			}
		})
	}

	return (
		<div className='grid w-[350px] gap-2 py-10'>
			<FormTitle title={'Создать аккаунт'} className='text-center mb-4' />
			<div className='grid gap-3'>
				{renderInput(
					'email',
					'Email',
					'email',
					'Ваш email',
					'Будет также логином для авторизации'
				)}
				{renderInput('nickname', 'Отображаемое имя', 'text', '', 'Ваш никнейм')}
				{renderInput('password', 'Пароль', 'password')}
				{renderInput('passwordConfirm', 'Подтвердите пароль', 'password')}

				<div className='my-3 grid gap-3'>
					{renderCheckbox(
						'agreementChecked',
						'Пользовательского соглашения',
						'/'
					)}
					{renderCheckbox(
						'policyChecked',
						'Политики обработки персональных данных',
						'/'
					)}
				</div>

				<FormButton
					title={isLoading ? 'Загрузка...' : 'Создать аккаунт'}
					isInvert={true}
					onClick={handleRegistration}
					disabled={isLoading}
				/>

				<div className='flex justify-center items-center font-medium text-sm gap-1 mt-2 select-none'>
					<h6 className=''>Уже есть аккаунт?</h6>
					<button
						onClick={navigateToLogin}
						className='hover:underline cursor-pointer underline-offset-4'
					>
						Войти
					</button>
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

export default RegistrationForm
