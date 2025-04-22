import { useState } from 'react'
import { FeedbackAPI } from '../api/FeedbackAPI'
import FormButton from '../components/form/FormButton'
import FormInfoContainer from '../components/form/FormInfoContainer'
import FormInfoField from '../components/form/FormInfoField'
import FormInput from '../components/form/FormInput'
import FormLabel from '../components/form/FormLabel'
import FormSubTitle from '../components/form/FormSubTitle'
import FormTextbox from '../components/form/FormTextbox'
import FormTitle from '../components/form/FormTitle'
import { useLoading } from '../hooks/UseLoading'
import { useStore } from '../hooks/UseStore'
import { IFeedbackData } from '../models/feedback/FeedbackData'

const FeedbackPage = () => {
	const [feedbackData, setFeedbackData] = useState<IFeedbackData>({
		email: '',
		title: '',
		message: '',
	})
	const [errors, setErrors] = useState<string[]>([])
	const { notificationsStore } = useStore()

	const handleChange = (field: keyof IFeedbackData, value: string) => {
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
