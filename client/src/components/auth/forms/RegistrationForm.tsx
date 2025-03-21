import { useState } from 'react'
import UseCustomNavigate from '../../../hooks/UseCustomNavigate'
import AuthButton from '../components/AuthButton'
import AuthCheckbox from '../components/AuthCheckbox'
import AuthInput from '../components/AuthInput'
import AuthLabel from '../components/AuthLabel'
import AuthTitle from '../components/AuthTitle'

const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
		passwordConfirm: '',
		agreementChecked: false,
		policyChecked: false,
	})

	const { navigateToLogin } = UseCustomNavigate()

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
			<AuthLabel name={label} htmlFor={id} />
			{description && (
				<h3 className='text-sm font-medium text-white/50 select-none'>
					{description}
				</h3>
			)}
			<AuthInput
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
			<AuthCheckbox
				checked={formData[id] as boolean}
				setChecked={value => handleChange(id, value)}
			/>
			<span className='text-sm font-medium'>
				Принимаю условия
				<br />
				<a href={linkHref} className='underline'>
					{linkText}
				</a>
				<span className='text-red-500 ml-1'>*</span>
			</span>
		</div>
	)

	return (
		<div className='grid w-[350px] gap-2'>
			<AuthTitle title={'Создать аккаунт'} className='text-center mb-4' />
			<div className='grid gap-3'>
				{renderInput(
					'email',
					'Email',
					'email',
					'Ваш email',
					'Будет также логином для авторизации'
				)}
				{renderInput('username', 'Отображаемое имя', 'text', '', 'Ваш никнейм')}
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

				<AuthButton
					title={'Создать аккаунт'}
					isInvert={true}
					onClick={() => {}}
				/>

				<div className='flex justify-center items-center font-medium text-sm gap-1 mt-2 select-none'>
					<h6 className=''>Уже есть аккаунт?</h6>
					<button
						onClick={navigateToLogin}
						className='underline cursor-pointer'
					>
						Войти
					</button>
				</div>
			</div>
		</div>
	)
}

export default RegistrationForm
