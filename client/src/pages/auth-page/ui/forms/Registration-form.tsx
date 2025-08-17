import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormCheckbox from '../../../../components/form-elements/Form-checkbox'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTitle from '../../../../components/form-elements/Form-title'
import PreventableLink from '../../../../components/utils/Preventable-link'
import { useLoading } from '../../../../hooks/use-loading'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { IRegistrationRequest } from '../../../../models/auth/request/registration-request'

const RegistrationForm = observer(() => {
	const { authStore, notificationStore } = useStore()

	const { navigateToLogin } = useNavigationPath()

	const [formData, setFormData] = useState<IRegistrationRequest>({
		email: '',
		nickname: '',
		password: '',
		passwordConfirm: '',
		agreementChecked: false,
		policyChecked: false,
	})

	const { execute: register, isLoading } = useLoading(authStore.register)

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
				id={''}
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

	const handleRegistration = async () => {
		if (!isFormValid || isLoading) return
		const result = await register(formData)
		if (Array.isArray(result)) {
			result.forEach(err => notificationStore.addErrorNotification(err))
		} else {
			notificationStore.addSuccessNotification('Вы успешно зарегистрировались!')
			notificationStore.addEmailSentNotification(result)
		}
	}

	const isFormValid = useMemo(() => {
		return (
			formData.agreementChecked &&
			formData.policyChecked &&
			formData.email.trim() &&
			formData.nickname.trim() &&
			formData.password &&
			formData.passwordConfirm
		)
	}, [formData])

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
					title={isLoading ? 'Регистрация...' : 'Создать аккаунт'}
					isInvert={true}
					onClick={handleRegistration}
					disabled={isLoading || !isFormValid}
					isLoading={isLoading}
				/>

				<div className='flex justify-center items-center font-medium text-sm gap-1 mt-2 select-none'>
					<h6>Уже есть аккаунт?</h6>
					<PreventableLink to={navigateToLogin} prevent={isLoading}>
						<button
							disabled={isLoading}
							className={`hover:underline cursor-pointer underline-offset-4 ${
								isLoading ? 'opacity-50 pointer-events-none' : ''
							}`}
						>
							Войти
						</button>
					</PreventableLink>
				</div>
			</div>
		</div>
	)
})

export default RegistrationForm
