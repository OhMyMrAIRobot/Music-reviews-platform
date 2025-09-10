import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import FormButton from '../../../../components/form-elements/Form-button'
import ConfirmationModal from '../../../../components/modals/Confirmation-modal'
import { useAuth } from '../../../../hooks/use-auth'
import { useLoading } from '../../../../hooks/use-loading'
import { useStore } from '../../../../hooks/use-store'
import ReleaseDetailsReviewFormText from '../release-details-estimation/forms/release-details-review-form/Release-details-review-form-text'

interface IProps {
	releaseId: string
}

const SendAuthorCommentForm: FC<IProps> = observer(({ releaseId }) => {
	const { releaseDetailsPageStore, notificationStore, authStore } = useStore()
	const { checkAuth } = useAuth()

	const authorComment = releaseDetailsPageStore.authorComments.find(
		c => c.userId === authStore.user?.id
	)

	const [title, setTitle] = useState<string>('')
	const [text, setText] = useState<string>('')
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)

	const { execute: postComment, isLoading: isPosting } = useLoading(
		releaseDetailsPageStore.postAuthorComment
	)
	const { execute: updateComment, isLoading: isUpdating } = useLoading(
		releaseDetailsPageStore.updateAuthorComment
	)
	const { execute: deleteComment, isLoading: isDeleting } = useLoading(
		releaseDetailsPageStore.deleteAuthorComment
	)

	const handleSubmit = async () => {
		if (
			!checkAuth() ||
			isPosting ||
			!isFormValid ||
			!hasChanges ||
			isUpdating ||
			isDeleting
		)
			return

		let errors = []
		if (authorComment) {
			errors = await updateComment(
				authorComment.id,
				title.trim() !== authorComment.title ? title.trim() : undefined,
				text.trim() !== authorComment.text ? text.trim() : undefined
			)
		} else {
			errors = await postComment(releaseId, title.trim(), text.trim())
		}

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				`Вы успешно ${
					authorComment ? 'изменили' : 'добавили'
				} авторский комментарий!`
			)
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	const handleDelete = async () => {
		if (!checkAuth() || !authorComment || isDeleting || isPosting || isUpdating)
			return

		const errors = await deleteComment(authorComment.id)

		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				`Вы успешно удалили авторский комментарий!`
			)
			setTitle('')
			setText('')
		} else {
			errors.forEach(err => notificationStore.addErrorNotification(err))
		}
	}

	useEffect(() => {
		if (authorComment) {
			setTitle(authorComment.title)
			setText(authorComment.text)
		}
	}, [authorComment])

	const isFormValid = useMemo(() => {
		return (
			title.trim().length <= 100 &&
			title.trim().length >= 5 &&
			text.trim().length >= 300
		)
	}, [text, title])

	const hasChanges = useMemo(() => {
		if (!authorComment) return true
		return authorComment.title !== title || authorComment.text !== text
	}, [authorComment, text, title])

	return (
		<>
			{confModalOpen && authorComment && (
				<ConfirmationModal
					title={'Вы действительно хотите удалить авторский комментарий?'}
					isOpen={confModalOpen}
					onConfirm={handleDelete}
					onCancel={() => setConfModalOpen(false)}
					isLoading={isDeleting}
				/>
			)}
			<div className='mt-10 mx-auto w-full'>
				<h3 className='text-xl lg:text-2xl font-bold '>
					{`${
						authorComment ? 'Редактировать' : 'Оставить'
					} авторский комментарий`}
				</h3>
				<div className='border bg-zinc-900 rounded-xl px-2.5 py-4 border-white/10 w-full max-w-200 mx-auto mt-5'>
					<ReleaseDetailsReviewFormText
						isReview={true}
						title={title}
						setTitle={setTitle}
						text={text}
						setText={setText}
					/>

					<div className='flex items-center justify-between mt-5'>
						{authorComment && (
							<div className='w-40'>
								<FormButton
									title={'Удалить'}
									isInvert={false}
									onClick={() => setConfModalOpen(true)}
									disabled={
										!authorComment || isPosting || isUpdating || isDeleting
									}
									isLoading={isPosting || isUpdating || isDeleting}
								/>
							</div>
						)}

						<div className='w-40 ml-auto'>
							<FormButton
								title={authorComment ? 'Изменить' : 'Отправить'}
								isInvert={true}
								onClick={handleSubmit}
								disabled={
									isPosting ||
									isUpdating ||
									isDeleting ||
									!isFormValid ||
									!hasChanges
								}
								isLoading={isPosting || isUpdating || isDeleting}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
})

export default SendAuthorCommentForm
