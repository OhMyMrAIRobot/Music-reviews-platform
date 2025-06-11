import { useState } from 'react'
import { FeedbackAPI } from '../api/feedback-api'
import FormButton from '../components/form-elements/Form-button'
import FormInfoContainer from '../components/form-elements/Form-info-container'
import FormInfoField from '../components/form-elements/Form-info-field'
import FormInput from '../components/form-elements/Form-input'
import FormLabel from '../components/form-elements/Form-label'
import FormSubTitle from '../components/form-elements/Form-subtitle'
import FormTitle from '../components/form-elements/Form-title'
import FormTextbox from '../components/form-elements/FormTextbox'
import { useLoading } from '../hooks/use-loading'
import { useStore } from '../hooks/use-store'
import { IFeedback } from '../models/feedback/feedback'

const FeedbackPage = () => {
	const [feedbackData, setFeedbackData] = useState<IFeedback>({
		email: '',
		title: '',
		message: '',
	})
	const [errors, setErrors] = useState<string[]>([])
	const { notificationsStore } = useStore()

	const handleChange = (field: keyof IFeedback, value: string) => {
		setFeedbackData(prev => ({ ...prev, [field]: value }))
	}

	const sendFeedback = async () => {
		setErrors([])
		try {
			await FeedbackAPI.sendFeedback(feedbackData)
			notificationsStore.addNotification({
				id: self.crypto.randomUUID(),
				text: 'Отзыв успешно отправлен!',
				isError: false,
			})
			setFeedbackData({ email: '', title: '', message: '' })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			setErrors(
				Array.isArray(e.response?.data?.message)
					? e.response?.data?.message
					: [e.response?.data?.message]
			)
		}
	}

	const { execute: send, isLoading } = useLoading(sendFeedback)

	return (
		<div className='grid w-[400px] gap-5 mx-auto'>
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
					placeholder={'Краткий заголовок (до 50 символов)'}
					type={'text'}
					value={feedbackData.title}
					setValue={value => handleChange('title', value)}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel name={'Описание'} htmlFor={'message'} />
				<FormTextbox
					id={'message'}
					placeholder={'Текст...'}
					value={feedbackData.message}
					setValue={value => handleChange('message', value)}
				/>
			</div>

			<FormButton
				title={isLoading ? 'Отправка...' : 'Отправить'}
				isInvert={true}
				onClick={send}
			/>

			{errors && (
				<FormInfoContainer>
					{errors.map(error => (
						<FormInfoField key={error} text={error} isError={true} />
					))}
				</FormInfoContainer>
			)}
		</div>
	)
}

export default FeedbackPage
