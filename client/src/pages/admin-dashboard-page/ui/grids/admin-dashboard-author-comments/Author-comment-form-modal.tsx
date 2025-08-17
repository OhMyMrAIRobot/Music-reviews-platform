import { FC, useEffect, useMemo, useState } from 'react'
import FormButton from '../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../components/form-elements/Form-label'
import FormTextbox from '../../../../../components/form-elements/Form-textbox'
import ModalOverlay from '../../../../../components/modals/Modal-overlay'
import { useLoading } from '../../../../../hooks/use-loading'
import { useStore } from '../../../../../hooks/use-store'
import { IAuthorComment } from '../../../../../models/author/author-comment/author-comment'

interface IProps {
	isOpen: boolean
	onClose: () => void
	comment: IAuthorComment
}

const AuthorCommentFormModal: FC<IProps> = ({ isOpen, onClose, comment }) => {
	const { adminDashboardAuthorCommentsStore, notificationStore } = useStore()

	const { execute: update, isLoading } = useLoading(
		adminDashboardAuthorCommentsStore.updateComment
	)

	const [title, setTitle] = useState<string>(comment.title)
	const [text, setText] = useState<string>(comment.text)

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
		if (!isFormValid) return

		const errors = await update(
			comment.id,
			title.trim() !== '' ? title.trim() : undefined,
			text.trim() !== '' ? text.trim() : undefined
		)
		if (errors.length === 0) {
			notificationStore.addSuccessNotification(
				'Авторский комментарий успешно обновлен!'
			)
			onClose()
		} else {
			errors.forEach(error => {
				notificationStore.addErrorNotification(error)
			})
		}
	}

	return (
		<ModalOverlay isOpen={isOpen} onCancel={onClose} isLoading={isLoading}>
			<div
				className={`relative rounded-xl w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 p-6`}
			>
				<div className='grid gap-6'>
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

					<div className='grid gap-2'>
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
							className='h-60'
						/>
					</div>

					<div className='flex gap-3 justify-start'>
						<div className='w-30'>
							<FormButton
								title={'Сохранить'}
								isInvert={true}
								onClick={updateComment}
								disabled={!hasChanges || isLoading || !isFormValid}
								isLoading={isLoading}
							/>
						</div>

						<div className='w-25'>
							<FormButton
								title={'Назад'}
								isInvert={false}
								onClick={onClose}
								disabled={isLoading}
							/>
						</div>
					</div>
				</div>
			</div>
		</ModalOverlay>
	)
}

export default AuthorCommentFormModal
