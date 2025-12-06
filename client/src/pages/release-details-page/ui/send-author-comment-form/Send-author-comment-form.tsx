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
import { constraints } from '../../../../utils/constraints'
import ReleaseDetailsReviewFormText from '../release-details-estimation/forms/release-details-review-form/Release-details-review-form-text'

interface IProps {
	releaseId: string
}

const SendAuthorCommentForm: FC<IProps> = observer(({ releaseId }) => {
	/** HOOKS */
	const { notificationStore, authStore } = useStore()
	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	/** STATE */
	const [title, setTitle] = useState<string>('')
	const [text, setText] = useState<string>('')
	const [confModalOpen, setConfModalOpen] = useState<boolean>(false)

	/**
	 * Query to get existing author comment by the user for this release
	 */
	const query: AuthorCommentsQuery = {
		releaseId,
	}

	const { data } = useQuery({
		queryKey: authorCommentsKeys.list(query),
		queryFn: () => AuthorCommentAPI.findAll(query),
		staleTime: 1000 * 60 * 5,
	})

	/** List of author comments */
	const authorComments = data?.items

	/** User's author comment for this release */
	const userAuthorComment = authorComments?.find(
		c => c.user.id === authStore.user?.id
	)

	/** EFFECTS */
	useEffect(() => {
		if (userAuthorComment) {
			setTitle(userAuthorComment.title)
			setText(userAuthorComment.text)
		}
	}, [userAuthorComment])

	/**
	 * Function to invalidate related queries after mutations
	 */
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

	/**
	 * Create mutation for adding a new author comment
	 */
	const { mutateAsync: asyncCreate, isPending: isCreating } = useMutation({
		mutationFn: (data: CreateAuthorCommentData) =>
			AuthorCommentAPI.create(data),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно добавили авторский комментарий!'
			)

			invalidateRelatedQueries()
		},
		onError(error: unknown) {
			handleApiError(error, 'Не удалось добавить авторский комментарий.')
		},
	})

	/**
	 * Update mutation for editing an existing author comment
	 */
	const { mutateAsync: asyncUpdate, isPending: isUpdating } = useMutation({
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

	/**
	 * Delete mutation for removing an existing author comment
	 */
	const { mutateAsync: asyncDelete, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => AuthorCommentAPI.delete(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification(
				'Вы успешно удалили авторский комментарий!'
			)
			setConfModalOpen(false)

			invalidateRelatedQueries()
		},
		onError(error: unknown) {
			handleApiError(error, 'Не удалось удалить авторский комментарий.')
		},
	})

	/**
	 * Check if any mutation is in progress
	 *
	 * @returns {boolean} - True if any mutation is in progress, false otherwise
	 */
	const isPending = useMemo(
		() => isCreating || isUpdating || isDeleting,
		[isCreating, isUpdating, isDeleting]
	)

	/**
	 * Check if the form inputs are valid
	 *
	 * @returns {boolean} - True if the form is valid, false otherwise
	 */
	const isFormValid = useMemo(() => {
		return (
			title.trim().length <= constraints.authorComment.maxTitleLength &&
			title.trim().length >= constraints.authorComment.minTitleLength &&
			text.trim().length >= constraints.authorComment.minTextLength &&
			text.trim().length <= constraints.authorComment.maxTextLength
		)
	}, [text, title])

	/**
	 * Check if there are changes in the form compared to the existing author comment
	 *
	 * @returns {boolean} - True if there are changes, false otherwise
	 */
	const hasChanges = useMemo(() => {
		if (!userAuthorComment) return true
		return userAuthorComment.title !== title || userAuthorComment.text !== text
	}, [userAuthorComment, text, title])

	/**
	 * Handle form submission for creating or updating an author comment
	 */
	const handleSubmit = async () => {
		if (!checkAuth() || !isFormValid || !hasChanges || isPending) return

		if (userAuthorComment) {
			return asyncUpdate({
				id: userAuthorComment.id,
				data: {
					title:
						title.trim() !== userAuthorComment.title ? title.trim() : undefined,
					text:
						text.trim() !== userAuthorComment.text ? text.trim() : undefined,
				},
			})
		} else {
			return asyncCreate({
				title: title.trim(),
				text: text.trim(),
				releaseId: releaseId,
			})
		}
	}

	/**
	 * Handle deletion of the existing author comment
	 */
	const handleDelete = async () => {
		if (!checkAuth() || !userAuthorComment || isPending) return

		return asyncDelete(userAuthorComment.id)
	}

	return (
		<>
			{confModalOpen && userAuthorComment && (
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
						userAuthorComment ? 'Редактировать' : 'Оставить'
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
						{userAuthorComment && (
							<div className='w-40'>
								<FormButton
									title={'Удалить'}
									isInvert={false}
									onClick={() => setConfModalOpen(true)}
									disabled={!userAuthorComment || isPending}
									isLoading={isDeleting}
								/>
							</div>
						)}

						<div className='w-40 ml-auto'>
							<FormButton
								title={userAuthorComment ? 'Изменить' : 'Отправить'}
								isInvert={true}
								onClick={handleSubmit}
								disabled={isPending || !isFormValid || !hasChanges}
								isLoading={isCreating || isUpdating}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
})

export default SendAuthorCommentForm
