/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { FeedbackAPI } from '../../api/feedback/feedback-api'
import FormButton from '../../components/form-elements/Form-button'
import FormInput from '../../components/form-elements/Form-input'
import FormLabel from '../../components/form-elements/Form-label'
import FormSubTitle from '../../components/form-elements/Form-subtitle'
import FormTextbox from '../../components/form-elements/Form-textbox'
import FormTitle from '../../components/form-elements/Form-title'
import { useStore } from '../../hooks/use-store'
import { IFeedbackData } from '../../models/feedback/feedback-data'
import { feedbackKeys } from '../../query-keys/feedback-keys'

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

	const queryClient = useQueryClient()

	const { mutateAsync: sendFeedbackMutate, isPending: isSending } = useMutation(
		{
			mutationFn: (payload: IFeedbackData) => FeedbackAPI.sendFeedback(payload),
			onSuccess: () => {
				notificationStore.addSuccessNotification('Отзыв успешно отправлен!')
				setFeedbackData({ email: '', title: '', message: '' })
				queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
			},
			onError: (e: any) => {
				const messages: string[] = Array.isArray(e?.response?.data?.message)
					? e.response.data.message
					: [e?.response?.data?.message || 'Не удалось отправить отзыв']
				messages.forEach(m => notificationStore.addErrorNotification(m))
			},
		}
	)

	const send = async () => {
		if (!isFormValid || isSending) return
		await sendFeedbackMutate(feedbackData)
	}

	const isFormValid = useMemo(() => {
		return (
			feedbackData.email.trim() !== '' &&
			feedbackData.message.trim().length >= 100 &&
			feedbackData.title.trim().length >= 5
		)
	}, [feedbackData])

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
					placeholder={'Текст (от 100 символов)'}
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
