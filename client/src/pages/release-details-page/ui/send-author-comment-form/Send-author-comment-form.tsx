import {
	InvalidateQueryFilters,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import { AuthorCommentAPI } from '../../../../api/author/author-comment-api'
import FormButton from '../../../../components/form-elements/Form-button'
import ConfirmationModal from '../../../../components/modals/Confirmation-modal'
import { useApiErrorHandler } from '../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../hooks/use-auth'
import { useStore } from '../../../../hooks/use-store'
import { authorCommentsKeys } from '../../../../query-keys/author-comments-keys'
import { leaderboardKeys } from '../../../../query-keys/leaderboard-keys'
import { platformStatsKeys } from '../../../../query-keys/platform-stats-keys'
import { profilesKeys } from '../../../../query-keys/profiles-keys'
import { releasesKeys } from '../../../../query-keys/releases-keys'
import {
	AuthorCommentsQuery,
	CreateAuthorCommentData,
	UpdateAuthorCommentData,
} from '../../../../types/author'
import ReleaseDetailsReviewFormText from '../release-details-estimation/forms/release-details-review-form/Release-details-review-form-text'

interface IProps {
	releaseId: string
}

const SendAuthorCommentForm: FC<IProps> = observer(({ releaseId }) => {
	const { notificationStore, authStore } = useStore()

	const { checkAuth } = useAuth()

	const queryClient = useQueryClient()

	const handleApiError = useApiErrorHandler()

	const [title, setTitle] = useState<string>('')
	const [text, setText] = useState<string>('')
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)

	const query: AuthorCommentsQuery = {
		releaseId,
	}

	const { data } = useQuery({
		queryKey: authorCommentsKeys.list(query),
		queryFn: () => AuthorCommentAPI.findAll(query),
		staleTime: 1000 * 60 * 5,
	})

	const authorComments = data?.items

	const authorComment = authorComments?.find(
		c => c.user.id === authStore.user?.id
	)

	// All queries need to be invalidated after mutations
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: authorCommentsKeys.all },
			{ queryKey: leaderboardKeys.all },
			{ queryKey: platformStatsKeys.all },
			{ queryKey: profilesKeys.profile(authStore.user?.id || 'unknown') },
			{ queryKey: releasesKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	const createMutation = useMutation({
		mutationFn: (data: CreateAuthorCommentData) =>
			AuthorCommentAPI.create(data),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно добавили авторский комментарий!'
			)
			setTitle('')
			setText('')

			invalidateRelatedQueries()
		},
		onError(error: unknown) {
			handleApiError(error, 'Не удалось добавить авторский комментарий.')
		},
	})

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateAuthorCommentData }) =>
			AuthorCommentAPI.update(id, data),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно изменили авторский комментарий!'
			)

			invalidateRelatedQueries()
		},
		onError(error: unknown) {
			handleApiError(error, 'Не удалось изменить авторский комментарий.')
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => AuthorCommentAPI.delete(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили авторский комментарий!'
			)
			setConfModalOpen(false)
			setTitle('')
			setText('')

			invalidateRelatedQueries()
		},
		onError(error: unknown) {
			handleApiError(error, 'Не удалось удалить авторский комментарий.')
		},
	})

	const handleSubmit = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			!isFormValid ||
			!hasChanges ||
			updateMutation.isPending ||
			deleteMutation.isPending
		)
			return

		if (authorComment) {
			return updateMutation.mutateAsync({
				id: authorComment.id,
				data: {
					title:
						title.trim() !== authorComment.title ? title.trim() : undefined,
					text: text.trim() !== authorComment.text ? text.trim() : undefined,
				},
			})
		} else {
			return createMutation.mutateAsync({
				title: title.trim(),
				text: text.trim(),
				releaseId: releaseId,
			})
		}
	}

	const handleDelete = async () => {
		if (
			!checkAuth() ||
			!authorComment ||
			deleteMutation.isPending ||
			createMutation.isPending ||
			updateMutation.isPending
		)
			return

		return deleteMutation.mutateAsync(authorComment.id)
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
					isLoading={deleteMutation.isPending}
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
										!authorComment ||
										createMutation.isPending ||
										updateMutation.isPending ||
										deleteMutation.isPending
									}
									isLoading={
										createMutation.isPending ||
										updateMutation.isPending ||
										deleteMutation.isPending
									}
								/>
							</div>
						)}

						<div className='w-40 ml-auto'>
							<FormButton
								title={authorComment ? 'Изменить' : 'Отправить'}
								isInvert={true}
								onClick={handleSubmit}
								disabled={
									createMutation.isPending ||
									updateMutation.isPending ||
									deleteMutation.isPending ||
									!isFormValid ||
									!hasChanges
								}
								isLoading={
									createMutation.isPending ||
									updateMutation.isPending ||
									deleteMutation.isPending
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
})

export default SendAuthorCommentForm
