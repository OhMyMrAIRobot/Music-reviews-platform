import {
	InvalidateQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { AuthorCommentAPI } from '../../../../../api/author/author-comment-api'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../../components/form-elements/Form-textbox'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import { useApiErrorHandler } from '../../../../../hooks/use-api-error-handler'
import { useStore } from '../../../../../hooks/use-store'
import { authorCommentsKeys } from '../../../../../query-keys/author-comments-keys'
import { releasesKeys } from '../../../../../query-keys/releases-keys'
import {
	AuthorComment,
	UpdateAuthorCommentData,
} from '../../../../../types/author'

interface IProps {
	isOpen: boolean
	onClose: () => void
	comment: AuthorComment
}

const AuthorCommentFormModal: FC<IProps> = ({ isOpen, onClose, comment }) => {
	const { notificationStore } = useStore()

	const handleApiError = useApiErrorHandler()

	const queryClient = useQueryClient()

	const [title, setTitle] = useState<string>(comment.title)
	const [text, setText] = useState<string>(comment.text)

	// All queries need to be invalidated after update
	const keysToInvalidate: InvalidateQueryFilters[] = [
		{ queryKey: authorCommentsKeys.all },
		{ queryKey: releasesKeys.details(comment.release.id) },
	]

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateAuthorCommentData }) =>
			AuthorCommentAPI.adminUpdate(id, data),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Авторский комментарий успешно обновлен!'
			)
			onClose()

			// invalidate related queries
			keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось обновить авторский комментарий.')
		},
	})

	useEffect(() => {
		setTitle(comment.title)
		setText(comment.text)
	}, [comment])

	const hasChanges = useMemo(() => {
		return title !== comment.title || text !== comment.text
	}, [title, comment.title, comment.text, text])

	const isFormValid = useMemo(() => {
		return (
			text.trim().length >= 300 &&
			title.trim().length >= 5 &&
			title.trim().length <= 100
		)
	}, [text, title])

	const updateComment = async () => {
		if (!isFormValid || updateMutation.isPending) return

		updateMutation.mutate({
			id: comment.id,
			data: {
				title: title.trim() !== comment.title ? title.trim() : undefined,
				text: text.trim() !== comment.text ? text.trim() : undefined,
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
				className={`relative rounded-xl w-full max-lg:h-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 p-6 max-h-full overflow-y-scroll`}
			>
				<div className='size-full flex flex-col gap-6'>
					<h1 className='border-b border-white/10 text-3xl font-bold py-4 text-center'>
						Редактирование авторского комментария
					</h1>

					<div className='grid gap-2'>
						<FormLabel
							name={'Заголовок'}
							htmlFor={'comment-title-input'}
							isRequired={false}
						/>
						<FormInput
							id={'comment-title-input'}
							placeholder={'Заголовок...'}
							type={'text'}
							value={title}
							setValue={setTitle}
						/>
					</div>

					<div className='flex-1 flex flex-col gap-2'>
						<FormLabel
							name={'Комментарий'}
							htmlFor={'comment-text-input'}
							isRequired={false}
						/>
						<FormTextbox
							id={'comment-text-input'}
							placeholder={'Комментарий...'}
							value={text}
							setValue={setText}
							className='h-full min-h-30 lg:h-60'
						/>
					</div>

					<div className='grid sm:flex gap-3 sm:justify-start'>
						<div className='w-full sm:w-30'>
							<FormButton
								title={'Сохранить'}
								isInvert={true}
								onClick={updateComment}
								disabled={
									!hasChanges || updateMutation.isPending || !isFormValid
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

export default AuthorCommentFormModal
