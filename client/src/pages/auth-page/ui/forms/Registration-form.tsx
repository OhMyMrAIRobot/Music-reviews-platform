import { useMemo, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import FormCheckbox from '../../../../components/form-elements/Form-checkbox'
import FormInput from '../../../../components/form-elements/Form-input'
import FormLabel from '../../../../components/form-elements/Form-label'
import FormTitle from '../../../../components/form-elements/Form-title'
import PreventableLink from '../../../../components/utils/Preventable-link'
import { useRegistrationMutation } from '../../../../hooks/mutations'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { constraints } from '../../../../utils/constraints'

/**
 * Represents state of registration form.
 */
type RegistrationFormState = {
	email: string
	nickname: string
	password: string
	passwordConfirm: string
	agreementChecked: boolean
	policyChecked: boolean
}

const RegistrationForm = () => {
	const { navigateToLogin } = useNavigationPath()
	const [formData, setFormData] = useState<RegistrationFormState>({
		email: '',
		nickname: '',
		password: '',
		passwordConfirm: '',
		agreementChecked: false,
		policyChecked: false,
	})

	const { mutateAsync: register, isPending: isLoading } =
		useRegistrationMutation()

	/**
	 * Handles changes in form inputs.
	 *
	 * @param field - The field to update.
	 * @param value - The new value for the field.
	 */
	const handleChange = (
		field: keyof typeof formData,
		value: string | boolean,
	) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	/**
	 * Renders an input field.
	 *
	 * @param id - The ID of the input field.
	 * @param label - The label for the input field.
	 * @param type - The type of the input field.
	 * @param placeholder - The placeholder text for the input field.
	 * @param description - An optional description for the input field.
	 *
	 * @returns The rendered input field.
	 */
	const renderInput = (
		id: keyof typeof formData,
		label: string,
		type: string,
		placeholder?: string,
		description?: string,
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

	/**
	 * Renders a checkbox with a link.
	 *
	 * @param id - The ID of the checkbox field.
	 * @param linkText - The text for the link.
	 * @param linkHref - The href for the link.
	 *
	 * @returns The rendered checkbox with a link.
	 */
	const renderCheckbox = (
		id: keyof typeof formData,
		linkText: string,
		linkHref: string,
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

	/**
	 * Indicates whether the form is valid for submission.
	 *
	 * @return {boolean} True if the form is valid, false otherwise.
	 */
	const isFormValid = useMemo(() => {
		return (
			formData.agreementChecked &&
			formData.policyChecked &&
			formData.email.trim().length >= constraints.user.minEmailLength &&
			formData.email.trim().length <= constraints.user.maxEmailLength &&
			formData.nickname.trim().length >= constraints.user.minNicknameLength &&
			formData.nickname.trim().length <= constraints.user.maxNicknameLength &&
			formData.password.length >= constraints.user.minPasswordLength &&
			formData.password.length <= constraints.user.maxPasswordLength &&
			formData.passwordConfirm.length >= constraints.user.minPasswordLength &&
			formData.passwordConfirm.length <= constraints.user.maxPasswordLength &&
			formData.password === formData.passwordConfirm
		)
	}, [formData])

	/**
	 * Handles form submission.
	 */
	const handleSubmit = async () => {
		if (!isFormValid || isLoading) return

		return register(formData)
	}

	return (
		<div className='grid w-full sm:w-[350px] gap-2 py-10'>
			<FormTitle title={'Создать аккаунт'} className='text-center mb-4' />
			<div className='grid gap-3'>
				{renderInput(
					'email',
					'Email',
					'email',
					'Ваш email',
					'Будет также логином для авторизации',
				)}
				{renderInput('nickname', 'Отображаемое имя', 'text', '', 'Ваш никнейм')}
				{renderInput('password', 'Пароль', 'password')}
				{renderInput('passwordConfirm', 'Подтвердите пароль', 'password')}

				<div className='my-3 grid gap-3'>
					{renderCheckbox(
						'agreementChecked',
						'Пользовательского соглашения',
						'/',
					)}
					{renderCheckbox(
						'policyChecked',
						'Политики обработки персональных данных',
						'/',
					)}
				</div>

				<FormButton
					title={isLoading ? 'Регистрация...' : 'Создать аккаунт'}
					isInvert={true}
					onClick={handleSubmit}
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
}

export default RegistrationForm
