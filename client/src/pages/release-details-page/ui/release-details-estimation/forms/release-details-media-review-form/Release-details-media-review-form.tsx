import {
	InvalidateQueryFilters,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import { ReleaseMediaAPI } from '../../../../../../api/release/release-media-api'
import FormButton from '../../../../../../components/form-elements/Form-button'
import FormInput from '../../../../../../components/form-elements/Form-input'
import FormLabel from '../../../../../../components/form-elements/Form-label'
import {
	useCreateMediaMutation,
	useUpdateMediaMutation,
} from '../../../../../../hooks/mutations'
import { useApiErrorHandler } from '../../../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useStore } from '../../../../../../hooks/use-store'
import { leaderboardKeys } from '../../../../../../query-keys/leaderboard-keys'
import { platformStatsKeys } from '../../../../../../query-keys/platform-stats-keys'
import { profilesKeys } from '../../../../../../query-keys/profiles-keys'
import { releaseMediaKeys } from '../../../../../../query-keys/release-media-keys'
import { ReleaseMediaQuery } from '../../../../../../types/release'
import { constraints } from '../../../../../../utils/constraints'

interface IProps {
	releaseId: string
}

const ReleaseDetailsMediaReviewForm: FC<IProps> = observer(({ releaseId }) => {
	/** HOOKS */
	const { notificationStore, authStore } = useStore()
	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()
	const handleApiError = useApiErrorHandler()

	/** STATES */
	const [title, setTitle] = useState<string>('')
	const [url, setUrl] = useState<string>('')

	/**
	 * Query to get user's media review for the release
	 */
	const query: ReleaseMediaQuery = {
		releaseId,
		userId: authStore.user?.id,
	}

	/**
	 * Function to invalidate related queries after mutations
	 */
	const invalidateRelatedQueries = () => {
		const keysToInvalidate: InvalidateQueryFilters[] = [
			{ queryKey: releaseMediaKeys.all },
			{ queryKey: profilesKeys.profile(authStore.user?.id || 'unknown') },
			{ queryKey: platformStatsKeys.all },
			{ queryKey: leaderboardKeys.all },
		]

		keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
	}

	/**
	 * Fetch user's media review for the release
	 */
	const { data: userReleaseMediaData } = useQuery({
		queryKey: releaseMediaKeys.list(query),
		queryFn: () => ReleaseMediaAPI.findAll(query),
		enabled: authStore.isAuth && !!authStore.user?.id,
		staleTime: 1000 * 60 * 5,
	})

	/** User's media review for this release */
	const userReleaseMedia =
		userReleaseMediaData?.items.length === 1
			? userReleaseMediaData?.items[0]
			: null

	/** EFFECTS */
	useEffect(() => {
		setTitle(userReleaseMedia?.title ?? '')
		setUrl(userReleaseMedia?.url ?? '')
	}, [userReleaseMedia])

	const { mutateAsync: createAsync, isPending: isCreating } =
		useCreateMediaMutation()

	const { mutateAsync: updateAsync, isPending: isUpdating } =
		useUpdateMediaMutation()

	/**
	 * Mutation for deleting an existing media review
	 */
	const { mutateAsync: deleteAsync, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => ReleaseMediaAPI.delete(id),
		onSuccess: () => {
			notificationStore.addSuccessNotification('Медиарецензия успешно удалена!')

			invalidateRelatedQueries()
		},
		onError: (error: unknown) => {
			handleApiError(error, 'Не удалось удалить медиарецензию.')
		},
	})

	/**
	 * Check if any mutation is in progress
	 *
	 * @returns {boolean} - True if any mutation is in progress, false otherwise
	 */
	const isSubmitting = useMemo(
		() => isCreating || isUpdating || isDeleting,
		[isCreating, isUpdating, isDeleting],
	)

	/**
	 * Check if the form inputs are valid
	 *
	 * @returns {boolean} - True if both title and url are non-empty, false otherwise
	 */
	const isValid = useMemo(() => {
		return (
			title.trim().length >= constraints.releaseMedia.minTitleLength &&
			title.trim().length <= constraints.releaseMedia.maxTitleLength &&
			url.trim().length >= constraints.releaseMedia.minUrlLength &&
			url.trim().length <= constraints.releaseMedia.maxUrlLength
		)
	}, [title, url])

	/**
	 * Check if there are any changes in the form compared to existing data
	 *
	 * @returns {boolean} - True if there are changes, false otherwise
	 */
	const hasChanges = useMemo(() => {
		if (!userReleaseMedia) return true
		return (
			userReleaseMedia.title.trim() !== title.trim() ||
			userReleaseMedia.url.trim() !== url.trim()
		)
	}, [title, url, userReleaseMedia])

	/**
	 * Handle form submission for creating or updating media review
	 */
	const handleSubmit = async () => {
		if (!checkAuth() || isSubmitting || !isValid || !hasChanges) return

		if (userReleaseMedia) {
			return updateAsync({
				id: userReleaseMedia.id,
				updateData: {
					title: title !== userReleaseMedia.title ? title.trim() : undefined,
					url: url !== userReleaseMedia.url ? url.trim() : undefined,
				},
			})
		} else {
			return createAsync({
				releaseId,
				title: title.trim(),
				url: url.trim(),
			})
		}
	}

	/**
	 * Handle deletion of the media review
	 */
	const handleDelete = async () => {
		if (!checkAuth() || !userReleaseMedia || isSubmitting) return

		return deleteAsync(userReleaseMedia.id)
	}

	return (
		<div className='border bg-zinc-900 rounded-xl p-4 border-white/10'>
			{userReleaseMedia && (
				<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
					Вы уже оставляли медиарецензию к данной работе. Вы можете изменить ее,
					заполнив форму ниже!
				</div>
			)}

			<div className='grid md:grid-cols-2 gap-y-3 gap-5'>
				<div className='grid gap-2'>
					<FormLabel
						name={'Заголовок'}
						htmlFor={'media-title-input'}
						isRequired={true}
					/>
					<FormInput
						id={'media-title-input'}
						placeholder={'Заголовок...'}
						type={'text'}
						value={title}
						setValue={setTitle}
					/>
				</div>

				<div className='grid gap-2'>
					<FormLabel
						name={'Ссылка на медиарецензию'}
						htmlFor={'media-url-input'}
						isRequired={true}
					/>
					<FormInput
						id={'media-url-input'}
						placeholder={'https://www.youtube.com/...'}
						type={'text'}
						value={url}
						setValue={setUrl}
					/>
				</div>
			</div>

			<div className='grid sm:flex items-center gap-y-3 sm:justify-between mt-6'>
				<div className='w-full sm:w-40'>
					<FormButton
						title={userReleaseMedia ? 'Обновить' : 'Отправить'}
						isInvert={true}
						onClick={handleSubmit}
						disabled={!isValid || !hasChanges || isSubmitting}
						isLoading={isCreating || isUpdating}
					/>
				</div>

				{userReleaseMedia && (
					<div className='w-full sm:w-40'>
						<FormButton
							title={'Удалить'}
							isInvert={false}
							onClick={handleDelete}
							disabled={!userReleaseMedia || isSubmitting}
							isLoading={isDeleting}
						/>
					</div>
				)}
			</div>
		</div>
	)
})

export default ReleaseDetailsMediaReviewForm
