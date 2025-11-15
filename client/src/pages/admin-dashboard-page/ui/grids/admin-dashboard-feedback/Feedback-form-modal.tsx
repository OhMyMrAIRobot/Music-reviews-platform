import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useState } from 'react'
import { FeedbackAPI } from '../../../../../api/feedback/feedback-api'
import { FeedbackReplyAPI } from '../../../../../api/feedback/feedback-reply-api'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../../components/form-elements/Form-textbox'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useFeedbackMeta } from '../../../../../hooks/use-feedback-meta'
import { useStore } from '../../../../../hooks/use-store'
import { IFeedback } from '../../../../../models/feedback/feedback'
import { IFeedbackReply } from '../../../../../models/feedback/feedback-reply/feedback-reply'
import { FeedbackStatusesEnum } from '../../../../../models/feedback/feedback-status/feedback-statuses-enum'
import { feedbackKeys } from '../../../../../query-keys/feedback-keys'
import { getFeedbackStatusColor } from '../../../../../utils/get-feedback-status-color'

interface IProps {
	isOpen: boolean
	onClose: () => void
	feedback: IFeedback
}

const FeedbackFormModal: FC<IProps> = ({ isOpen, onClose, feedback }) => {
	const { notificationStore } = useStore()

	const { statuses, isLoading: isMetaLoading } = useFeedbackMeta()

	const queryClient = useQueryClient()

	const [reply, setReply] = useState<IFeedbackReply | null>(null)
	const [showReply, setShowReply] = useState<boolean>(false)
	const [replyText, setReplyText] = useState<string>('')

	const { data: replyData, isPending: isReplyLoading } = useQuery({
		queryKey: feedbackKeys.reply(feedback.id),
		queryFn: () => FeedbackReplyAPI.fetchFeedbackReply(feedback.id),
		enabled:
			isOpen &&
			feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED,
		staleTime: 1000 * 60 * 5,
	})

	const updateStatusMutation = useMutation({
		mutationFn: (statusId: string) =>
			FeedbackAPI.updateFeedbackStatus(feedback.id, statusId),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно отметили сообщение как прочитанное!'
			)
			queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
		},
		onError: (error: unknown) => {
			const axiosError = error as {
				response?: { data?: { message?: string[] } }
			}
			const errors = axiosError?.response?.data?.message || [
				'Ошибка при обновлении статуса',
			]
			errors.forEach((err: string) =>
				notificationStore.addErrorNotification(err)
			)
		},
	})

	const createReplyMutation = useMutation({
		mutationFn: (replyData: { message: string; feedbackId: string }) =>
			FeedbackReplyAPI.createFeedbackReply(replyData),
		onSuccess: data => {
			if (data.isSent) {
				notificationStore.addSuccessNotification('Ответ успешно отправлен!')
				setReply(data.feedbackReply)
				setShowReply(false)
				setReplyText('')
				queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
				queryClient.invalidateQueries({
					queryKey: feedbackKeys.reply(feedback.id),
				})
			} else {
				notificationStore.addErrorNotification('Не удалось отправить ответ!')
			}
			onClose()
		},
		onError: (error: unknown) => {
			const axiosError = error as {
				response?: { data?: { message?: string[] } }
			}
			const errors = axiosError?.response?.data?.message || [
				'Ошибка при отправке ответа',
			]
			errors.forEach((err: string) =>
				notificationStore.addErrorNotification(err)
			)
		},
	})

	const updateReadStatus = () => {
		if (feedback.feedbackStatus.status !== FeedbackStatusesEnum.NEW) {
			notificationStore.addErrorNotification(
				'Вы не можете отметить данное сообщение как прочитанное!'
			)
			return
		}

		const newStatus = statuses.find(
			entry => entry.status === FeedbackStatusesEnum.READ
		)

		if (newStatus) {
			updateStatusMutation.mutate(newStatus.id)
		}
	}

	const postReply = () => {
		if (reply || replyText.trim().length === 0) return

		createReplyMutation.mutate({
			message: replyText,
			feedbackId: feedback.id,
		})
	}

	useEffect(() => {
		setReply(null)
		setReplyText('')
		if (feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED) {
			setReply(replyData || null)
		}
	}, [feedback, replyData])

	return (
		<ModalOverlay
			isOpen={isOpen}
			onCancel={onClose}
			isLoading={
				updateStatusMutation.isPending || createReplyMutation.isPending
			}
			className='max-lg:size-full'
		>
			{isReplyLoading &&
			feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED ? (
				<SkeletonLoader className='w-240 h-148 rounded-xl' />
			) : (
				<div
					className={`relative rounded-xl w-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6 max-h-full overflow-y-scroll`}
				>
					<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
						{`${!reply && showReply ? 'Написание' : 'Просмотр'} ${
							showReply ? 'ответа' : 'сообщения'
						}`}
					</h1>{' '}
					{!(showReply && !reply) && (
						<div className='border-b border-white/10 px-6 py-4 flex gap-2 w-full flex-col font-medium h-38'>
							{!showReply && (
								<h6 className='line-clamp-1'>{`Email: ${feedback.email}`}</h6>
							)}
							{!showReply && (
								<h6 className='break-words'>{`Заголовок: ${feedback.title}`}</h6>
							)}
							{showReply ? (
								reply && (
									<h6>{`Ответил: ${reply.user?.nickname ?? 'Неизвестно'}`}</h6>
								)
							) : (
								<h6>
									{`Статус: `}
									<span
										className={`${getFeedbackStatusColor(
											feedback.feedbackStatus.status
										)}`}
									>
										{feedback.feedbackStatus.status}
									</span>
								</h6>
							)}

							{showReply ? (
								reply && (
									<h6 className='break-words'>{`Дата ответа: ${reply.createdAt}`}</h6>
								)
							) : (
								<h6 className='break-words'>{`Дата отправки: ${feedback.createdAt}`}</h6>
							)}
						</div>
					)}
					{showReply && !reply ? (
						<div className='flex flex-col gap-3 px-6 py-4 h-70 max-h-70'>
							<FormLabel
								name={'Текст ответа'}
								htmlFor={'feedback-reply-textbox'}
								isRequired={true}
							/>
							<FormTextbox
								id={'feedback-reply-textbox'}
								placeholder={'Текст ответа...'}
								value={replyText}
								setValue={setReplyText}
								className='h-full'
							/>
						</div>
					) : (
						<div className='px-6 py-4 flex gap-10 w-full h-70 max-h-70 overflow-y-scroll font-light'>
							<h6 className='break-words w-full'>
								<span className='font-bold'>
									{`Текст ${showReply ? 'ответа' : 'сообщения'}: `}
								</span>
								{showReply && reply ? reply.message : feedback.message}
							</h6>
						</div>
					)}
					<div className='pt-6 px-6 grid grid-rows-2 sm:flex gap-3 sm:justify-start border-t-1 border-white/10'>
						{isMetaLoading ? (
							<SkeletonLoader className='w-full sm:w-35 h-10 rounded-md' />
						) : (
							<>
								{showReply && !reply ? (
									<>
										<div className='w-full sm:w-35'>
											<FormButton
												title={'Отправить'}
												isInvert={true}
												onClick={postReply}
												disabled={
													!replyText.trim() || createReplyMutation.isPending
												}
												isLoading={createReplyMutation.isPending}
											/>
										</div>
										<div className='w-full sm:w-25'>
											<FormButton
												title={'Назад'}
												isInvert={false}
												onClick={() => {
													setShowReply(false)
													setReplyText('')
												}}
												disabled={createReplyMutation.isPending}
											/>
										</div>
									</>
								) : feedback.feedbackStatus.status ===
								  FeedbackStatusesEnum.NEW ? (
									<div className='w-full sm:w-35'>
										<FormButton
											title={'Прочитано'}
											isInvert={true}
											onClick={updateReadStatus}
											disabled={
												feedback.feedbackStatus.status !==
													FeedbackStatusesEnum.NEW ||
												updateStatusMutation.isPending
											}
											isLoading={updateStatusMutation.isPending}
										/>
									</div>
								) : (
									<div className='w-full sm:w-35'>
										<FormButton
											title={
												reply
													? `Посмотреть ${showReply ? 'сообщение' : 'ответ'}`
													: 'Написать ответ'
											}
											isInvert={true}
											onClick={() => setShowReply(!showReply)}
											disabled={false}
										/>
									</div>
								)}
							</>
						)}

						<div className='w-full sm:w-25 sm:ml-auto'>
							<FormButton
								title={'Закрыть'}
								isInvert={false}
								onClick={onClose}
								disabled={
									createReplyMutation.isPending ||
									updateStatusMutation.isPending
								}
							/>
						</div>
					</div>
				</div>
			)}
		</ModalOverlay>
	)
}

export default FeedbackFormModal
