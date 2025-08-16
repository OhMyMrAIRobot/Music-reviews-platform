import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../../components/form-elements/Form-textbox'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import SkeletonLoader from '../../../../../components/utils/Skeleton-loader'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { IFeedback } from '../../../../../models/feedback/feedback'
import { IFeedbackReply } from '../../../../../models/feedback/feedback-reply/feedback-reply'
import { FeedbackStatusesEnum } from '../../../../../models/feedback/feedback-status/feedback-statuses-enum'
import { getFeedbackStatusColor } from '../../../../../utils/get-feedback-status-color'

interface IProps {
	isOpen: boolean
	onClose: () => void
	feedback: IFeedback
}

const FeedbackFormModal: FC<IProps> = observer(
	({ isOpen, onClose, feedback }) => {
		const { adminDashboardFeedbackStore, metaStore, notificationStore } =
			useStore()

		const [reply, setReply] = useState<IFeedbackReply | null>(null)
		const [showReply, setShowReply] = useState<boolean>(false)
		const [replyText, setReplyText] = useState<string>('')

		const { execute: fetchStatuses, isLoading: isStatusesLoading } = useLoading(
			metaStore.fetchFeedbackStatuses
		)

		const { execute: fetchReply, isLoading: isReplyLoading } = useLoading(
			adminDashboardFeedbackStore.fetchFeedbackReply
		)

		const { execute: updateFeedback, isLoading: isUpdatingStatus } = useLoading(
			adminDashboardFeedbackStore.updateFeedback
		)

		const { execute: createReply, isLoading: isReplyPosting } = useLoading(
			adminDashboardFeedbackStore.createFeedbackReply
		)

		const updateReadStatus = async () => {
			if (feedback.feedbackStatus.status !== FeedbackStatusesEnum.NEW) {
				notificationStore.addErrorNotification(
					'Вы не можете отметить данное сообщение как прочитанное!'
				)
				return
			}

			const newStatus = metaStore.feedbackStatuses.find(
				entry => entry.status === FeedbackStatusesEnum.READ
			)

			if (newStatus) {
				const errors = await updateFeedback(feedback.id, newStatus.id)

				if (errors.length === 0) {
					notificationStore.addSuccessNotification(
						'Вы успешно отметили сообщение как прочитанное!'
					)
				} else {
					errors.forEach(err => notificationStore.addErrorNotification(err))
				}
			}
		}

		const postReply = async () => {
			if (reply || replyText.trim().length === 0) return

			const result = await createReply({
				message: replyText,
				feedbackId: feedback.id,
			})

			if (Array.isArray(result)) {
				result.forEach(err => notificationStore.addErrorNotification(err))
			} else {
				if (result) {
					notificationStore.addSuccessNotification('Ответ успешно отправлен!')
					setReply(adminDashboardFeedbackStore.feedbackReply)
					setShowReply(false)
					setReplyText('')
				} else {
					notificationStore.addErrorNotification('Не удалось отправить ответ!')
				}
			}
		}

		useEffect(() => {
			if (metaStore.feedbackStatuses.length === 0) {
				fetchStatuses()
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [])

		useEffect(() => {
			setReply(null)
			setReplyText('')
			if (feedback.feedbackStatus.status === FeedbackStatusesEnum.ANSWERED) {
				fetchReply(feedback.id).then(() =>
					setReply(adminDashboardFeedbackStore.feedbackReply)
				)
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [feedback])

		return (
			<ModalOverlay
				isOpen={isOpen}
				onCancel={onClose}
				isLoading={isReplyPosting || isUpdatingStatus}
			>
				{isReplyLoading ? (
					<SkeletonLoader className='w-240 h-148 rounded-xl' />
				) : (
					<div
						className={`relative rounded-xl w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 pb-6`}
					>
						<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
							{`${!reply && showReply ? 'Написание' : 'Просмотр'} ${
								showReply ? 'ответа' : 'сообщения'
							}`}
						</h1>

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
										<h6>{`Ответил: ${
											reply.user?.nickname ?? 'Неизвестно'
										}`}</h6>
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

						<div className='pt-6 px-6 flex gap-3 justify-start border-t-1 border-white/10'>
							{isStatusesLoading ? (
								<SkeletonLoader className='w-35 h-10 rounded-md' />
							) : (
								<>
									{showReply && !reply ? (
										<>
											<div className='w-35'>
												<FormButton
													title={'Отправить'}
													isInvert={true}
													onClick={postReply}
													disabled={!replyText.trim() || isReplyPosting}
													isLoading={isReplyPosting}
												/>
											</div>
											<div className='w-25'>
												<FormButton
													title={'Назад'}
													isInvert={false}
													onClick={() => {
														setShowReply(false)
														setReplyText('')
													}}
													disabled={isReplyPosting}
												/>
											</div>
										</>
									) : feedback.feedbackStatus.status ===
									  FeedbackStatusesEnum.NEW ? (
										<div className='w-35'>
											<FormButton
												title={'Прочитано'}
												isInvert={true}
												onClick={updateReadStatus}
												disabled={
													feedback.feedbackStatus.status !==
														FeedbackStatusesEnum.NEW || isUpdatingStatus
												}
												isLoading={isUpdatingStatus}
											/>
										</div>
									) : (
										<div className='w-35'>
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

							<div className='w-25 ml-auto'>
								<FormButton
									title={'Закрыть'}
									isInvert={false}
									onClick={onClose}
									disabled={isReplyPosting || isUpdatingStatus}
								/>
							</div>
						</div>
					</div>
				)}
			</ModalOverlay>
		)
	}
)

export default FeedbackFormModal
