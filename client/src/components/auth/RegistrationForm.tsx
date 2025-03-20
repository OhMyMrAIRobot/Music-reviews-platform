import { useState } from 'react'
import AuthButton from './AuthButton'
import AuthCheckbox from './AuthCheckbox'
import AuthInput from './AuthInput'
import AuthLabel from './AuthLabel'

const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
		passwordConfirm: '',
		agreementChecked: false,
		policyChecked: false,
	})

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
		<div className='flex items-center space-x-2'>
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
			<h2 className='text-3xl font-bold text-center mb-4 select-none'>
				Создать аккаунт
			</h2>
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

				<div className='flex justify-center items-center font-medium text-sm gap-1 mt-2'>
					<h6 className=''>Уже есть аккаунт?</h6>
					<a href='/' className='underline'>
						Войти
					</a>
				</div>
			</div>
		</div>
	)
}

export default RegistrationForm
