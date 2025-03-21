import { useState } from 'react'
import AuthButton from '../components/AuthButton'
import AuthInput from '../components/AuthInput'
import AuthLabel from '../components/AuthLabel'
import AuthSubTitle from '../components/AuthSubTitle'
import AuthTitle from '../components/AuthTitle'

const ResetPasswordForm = () => {
	const [formData, setFormData] = useState({
		password: '',
		passwordConfirm: '',
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

	return (
		<div className='grid gap-4 w-[330px]'>
			<div className='grid gap-1'>
				<AuthTitle title={'Сброс пароля'} />
				<AuthSubTitle title={'Введите новый пароль для аккаунта'} />
			</div>
			{renderInput('password', 'Пароль', 'password')}
			{renderInput('passwordConfirm', 'Подтвердите пароль', 'password')}
			<AuthButton
				title={'Сбросить пароль'}
				onClick={() => {}}
				isInvert={true}
			/>
		</div>
	)
}

export default ResetPasswordForm
