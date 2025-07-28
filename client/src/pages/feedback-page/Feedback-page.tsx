import { useMemo, useState } from 'react'
import { FeedbackAPI } from '../../api/feedback-api'
import FormButton from '../../components/form-elements/Form-button'
import FormInput from '../../components/form-elements/Form-input'
import FormLabel from '../../components/form-elements/Form-label'
import FormSubTitle from '../../components/form-elements/Form-subtitle'
import FormTextbox from '../../components/form-elements/Form-textbox'
import FormTitle from '../../components/form-elements/Form-title'
import { useLoading } from '../../hooks/use-loading'
import { useStore } from '../../hooks/use-store'
import { IFeedbackData } from '../../models/feedback/feedback-data'

const FeedbackPage = () => {
	const { notificationStore } = useStore()

	const [feedbackData, setFeedbackData] = useState<IFeedbackData>({
		email: '',
		title: '',
		message: '',
	})

	const handleChange = (field: keyof IFeedbackData, value: string) => {
		setFeedbackData(prev => ({ ...prev, [field]: value }))
	}

	const sendFeedback = async () => {
		try {
			await FeedbackAPI.sendFeedback(feedbackData)
			notificationStore.addSuccessNotification('Отзыв успешно отправлен!')
			setFeedbackData({ email: '', title: '', message: '' })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			const errors: string[] = Array.isArray(e.response?.data?.message)
				? e.response?.data?.message
				: [e.response?.data?.message]
			errors.forEach(error => {
				notificationStore.addErrorNotification(error)
			})
		}
	}

	const { execute: send, isLoading } = useLoading(sendFeedback)

	const isFormValid = useMemo(() => {
		return (
			feedbackData.email !== '' &&
			feedbackData.message.length >= 100 &&
			feedbackData.title.length >= 5
		)
	}, [feedbackData])

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
					setValue={value => handleChange('email', value.trim())}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel name={'Заголовок'} htmlFor={'title'} />
				<FormInput
					id={'title'}
					placeholder={'Краткий заголовок (до 50 символов)'}
					type={'text'}
					value={feedbackData.title}
					setValue={value => handleChange('title', value.trim())}
				/>
			</div>

			<div className='grid gap-2'>
				<FormLabel name={'Описание'} htmlFor={'message'} />
				<FormTextbox
					id={'message'}
					placeholder={'Текст...'}
					value={feedbackData.message}
					setValue={value => handleChange('message', value.trim())}
					className='h-50'
				/>
			</div>

			<FormButton
				title={isLoading ? 'Отправка...' : 'Отправить'}
				isInvert={true}
				onClick={send}
				disabled={isLoading || !isFormValid}
			/>
		</div>
	)
}

export default FeedbackPage
