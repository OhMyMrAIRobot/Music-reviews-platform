import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { ReviewAPI } from '../../../../../api/review/review-api'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../../components/form-elements/Form-textbox'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import { useStore } from '../../../../../hooks/use-store'
import { IAdminReview } from '../../../../../models/review/admin-review/admin-review'
import { IAdminUpdateReviewData } from '../../../../../models/review/admin-review/admin-update-review-data'
import { reviewsKeys } from '../../../../../query-keys/reviews-keys'

interface IProps {
	isOpen: boolean
	onClose: () => void
	review: IAdminReview
}

const ReviewFormModal: FC<IProps> = ({ review, isOpen, onClose }) => {
	const { notificationStore } = useStore()

	const queryClient = useQueryClient()

	const updateMutation = useMutation({
		mutationFn: ({
			userId,
			reviewId,
			reviewData,
		}: {
			userId: string
			reviewId: string
			reviewData: IAdminUpdateReviewData
		}) => ReviewAPI.adminUpdateReview(userId, reviewId, reviewData),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Рецензия успешно обновлена!')
			queryClient.invalidateQueries({ queryKey: reviewsKeys.all })
			onClose()
		},
		onError: (error: unknown) => {
			const axiosError = error as {
				response?: { data?: { message?: string[] } }
			}
			const errors = axiosError?.response?.data?.message || [
				'Ошибка при обновлении рецензии',
			]
			errors.forEach((err: string) =>
				notificationStore.addErrorNotification(err)
			)
		},
	})

	const [title, setTitle] = useState<string>(review.title)
	const [text, setText] = useState<string>(review.text)

	useEffect(() => {
		setTitle(review.title)
		setText(review.text)
	}, [review])

	const hasChanges = useMemo(() => {
		return title !== review.title || text !== review.text
	}, [title, text, review.title, review.text])

	const textAndTitleTogether = useMemo(() => {
		return (
			(text.trim() !== '' && title.trim() !== '') ||
			(text.trim() === '' && title.trim() === '')
		)
	}, [text, title])

	const handleSubmit = () => {
		updateMutation.mutate({
			userId: review.user.id,
			reviewId: review.id,
			reviewData: {
				title: title.trim() !== '' ? title.trim() : undefined,
				text: text.trim() !== '' ? text.trim() : undefined,
			},
		})
	}

	return (
		<ModalOverlay
			isOpen={isOpen}
			onCancel={onClose}
			isLoading={updateMutation.isPending}
			className='max-lg:size-full'
		>
			<div
				className={`relative rounded-xl w-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 p-6 max-h-full max-lg:h-full overflow-y-scroll`}
			>
				<div className='size-full flex flex-col space-y-6'>
					<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
						Редактирование рецензии
					</h1>

					<div className='flex flex-col gap-2'>
						<FormLabel
							name={'Заголовок'}
							htmlFor={'review-title-input'}
							isRequired={false}
						/>
						<FormInput
							id={'review-title-input'}
							placeholder={'Заголовок рецензии...'}
							type={'text'}
							value={title}
							setValue={setTitle}
						/>
					</div>

					<div className='flex flex-col flex-1 gap-2'>
						<FormLabel
							name={'Текст рецензии'}
							htmlFor={'review-text-input'}
							isRequired={false}
						/>
						<FormTextbox
							id={'review-text-input'}
							placeholder={'Текст рецензии...'}
							value={text}
							setValue={setText}
							className='h-full min-h-30 lg:h-60'
						/>
					</div>

					<div className='w-full grid grid-rows-2 sm:flex gap-3 sm:justify-start'>
						<div className='w-full sm:w-30'>
							<FormButton
								title={'Сохранить'}
								isInvert={true}
								onClick={handleSubmit}
								disabled={
									!hasChanges ||
									!textAndTitleTogether ||
									updateMutation.isPending
								}
								isLoading={updateMutation.isPending}
							/>
						</div>

						<div className='w-full sm:w-25'>
							<FormButton
								title={'Назад'}
								isInvert={false}
								onClick={onClose}
								disabled={updateMutation.isPending}
							/>
						</div>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default ReviewFormModal
