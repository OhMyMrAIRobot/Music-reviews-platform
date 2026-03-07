import { useMemo, useState } from 'react'
import FormButton from '../../components/form-elements/Form-button'
import FormInput from '../../components/form-elements/Form-input'
import FormLabel from '../../components/form-elements/Form-label'
import FormSubTitle from '../../components/form-elements/Form-subtitle'
import FormTextbox from '../../components/form-elements/Form-textbox'
import FormTitle from '../../components/form-elements/Form-title'
import { useSendFeedbackMutation } from '../../hooks/mutations'
import { CreateFeedbackData } from '../../types/feedback'
import { constraints } from '../../utils/constraints'

const FeedbackPage = () => {
	const [feedbackData, setFeedbackData] = useState<CreateFeedbackData>({
		email: '',
		title: '',
		message: '',
	})

	const { mutateAsync: sendAsync, isPending: isSending } =
		useSendFeedbackMutation({
			onSuccess: () => {
				setFeedbackData({
					email: '',
					title: '',
					message: '',
				})
			},
		})

	/**
	 * Checks if the form is valid
	 *
	 * @returns {boolean} - True if the form is valid, false otherwise
	 */
	const isFormValid = useMemo(() => {
		return (
			feedbackData.email.trim().length >= constraints.feedback.minEmailLength &&
			feedbackData.email.trim().length <= constraints.feedback.maxEmailLength &&
			feedbackData.message.trim().length >=
				constraints.feedback.minMessageLength &&
			feedbackData.message.trim().length <=
				constraints.feedback.maxMessageLength &&
			feedbackData.title.trim().length >= constraints.feedback.minTitleLength &&
			feedbackData.title.trim().length <= constraints.feedback.maxTitleLength
		)
	}, [feedbackData])

	/**
	 * Handles the change of a form field
	 *
	 * @param {keyof CreateFeedbackData} field - The field to change
	 * @param {string} value - The new value of the field
	 */
	const handleChange = (field: keyof CreateFeedbackData, value: string) => {
		setFeedbackData(prev => ({ ...prev, [field]: value }))
	}

	/**
	 * Handles the send button click event
	 */
	const send = async () => {
		if (!isFormValid || isSending) return
		await sendAsync(feedbackData)
	}

	return (
		<div className='grid w-full md:w-[400px] gap-5 mx-auto'>
			<div className='grid gap-3 text-center'>
				<FormTitle title={'Связаться с нами'} />
				<FormSubTitle
					title={
						'Отправьте сообщение об ошибке, нарушениях или предложениях по улучшению'
					}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel name={'Email'} htmlFor={'email'} />
				<FormInput
					id={'email'}
					placeholder={'mail@example.com'}
					type={'email'}
					value={feedbackData.email}
					setValue={value => handleChange('email', value)}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel name={'Заголовок'} htmlFor={'title'} />
				<FormInput
					id={'title'}
					placeholder={`Краткий заголовок (от ${constraints.feedback.minTitleLength} до ${constraints.feedback.maxTitleLength} символов)`}
					type={'text'}
					value={feedbackData.title}
					setValue={value => handleChange('title', value)}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel name={'Описание'} htmlFor={'message'} />
				<FormTextbox
					id={'message'}
					placeholder={`Текст (от ${constraints.feedback.minMessageLength} до ${constraints.feedback.maxMessageLength} символов)`}
					value={feedbackData.message}
					setValue={value => handleChange('message', value)}
					className='h-50'
				/>
			</div>

			<FormButton
				title={isSending ? 'Отправка...' : 'Отправить'}
				isInvert={true}
				onClick={send}
				disabled={isSending || !isFormValid}
				isLoading={isSending}
			/>
		</div>
	)
}

export default FeedbackPage
