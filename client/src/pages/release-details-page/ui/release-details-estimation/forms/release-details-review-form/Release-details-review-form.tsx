import {
	InvalidateQueryFilters,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import { ReviewAPI } from '../../../../../../api/review/review-api'
import TickSvg from '../../../../../../components/svg/Tick-svg'
import Loader from '../../../../../../components/utils/Loader'
import { useCreateReviewMutation } from '../../../../../../hooks/mutations/review/use-create-review-mutation'
import { useApiErrorHandler } from '../../../../../../hooks/use-api-error-handler'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useStore } from '../../../../../../hooks/use-store'
import { leaderboardKeys } from '../../../../../../query-keys/leaderboard-keys'
import { platformStatsKeys } from '../../../../../../query-keys/platform-stats-keys'
import { profilesKeys } from '../../../../../../query-keys/profiles-keys'
import { releasesKeys } from '../../../../../../query-keys/releases-keys'
import { reviewsKeys } from '../../../../../../query-keys/reviews-keys'
import {
	Review,
	ReviewsQuery,
	UpdateReviewData,
} from '../../../../../../types/review'
import { calculateTotalReviewMark } from '../../../../../../utils/calculate-total-review-mark'
import { constraints } from '../../../../../../utils/constraints'
import ReleaseDetailsEstimationDeleteButton from '../../buttons/Release-details-estimation-delete-button'
import ReleaseDetailsReviewFormMarks from './Release-details-review-form-marks'
import ReleaseDetailsReviewFormText from './Release-details-review-form-text'

/**
 * Props for ReleaseDetailsReviewForm component
 *
 * @property {boolean} isReview - Indicates if the form is for a review or just a mark
 * @property {string} releaseId - The id of the release
 */
interface IProps {
	isReview: boolean
	releaseId: string
}

const ReleaseDetailsReviewForm: FC<IProps> = observer(
	({ isReview, releaseId }) => {
		/** HOOKS */
		const { authStore, notificationStore } = useStore()
		const { checkAuth } = useAuth()
		const queryClient = useQueryClient()
		const handleApiError = useApiErrorHandler()

		/** STATES */
		const [title, setTitle] = useState<string>('')
		const [text, setText] = useState<string>('')
		const [rhymes, setRhymes] = useState<number>(5)
		const [structure, setStructure] = useState<number>(5)
		const [realization, setRealization] = useState<number>(5)
		const [individuality, setIndividuality] = useState<number>(5)
		const [atmosphere, setAtmosphere] = useState<number>(1)
		const [total, setTotal] = useState<number>(28)

		/**
		 * Query to get user's review for the release
		 */
		const query: ReviewsQuery = {
			releaseId,
			userId: authStore.user?.id,
			withTextOnly: false,
		}

		/**
		 * Fetch reviews data
		 */
		const { data: reviewsData } = useQuery({
			queryKey: reviewsKeys.list(query),
			queryFn: () => ReviewAPI.findAll(query),
			enabled: authStore.isAuth && authStore.user?.id !== undefined,
			staleTime: 1000 * 60 * 5,
			retry: false,
		})

		const userReview =
			reviewsData && reviewsData?.items.length > 0
				? reviewsData?.items[0]
				: null

		/**
		 * Invalidate related queries after mutations
		 */
		const invalidateRelatedQueries = () => {
			const keysToInvalidate: InvalidateQueryFilters[] = [
				{ queryKey: releasesKeys.details(releaseId) },
				{ queryKey: profilesKeys.profile(authStore.user?.id || 'unknown') },
				{ queryKey: leaderboardKeys.all },
				{ queryKey: platformStatsKeys.all },
				{ queryKey: reviewsKeys.all },
				{ queryKey: releasesKeys.all },
			]

			keysToInvalidate.forEach(key => queryClient.invalidateQueries(key))
		}

		const { mutateAsync: createAsync, isPending: isCreating } =
			useCreateReviewMutation()

		/**
		 * Update a review mutation
		 */
		const { mutateAsync: updateAsync, isPending: isUpdating } = useMutation({
			mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
				ReviewAPI.update(id, data),
			onSuccess: () => {
				notificationStore.addSuccessNotification(
					`Вы успешно обновили ${isReview ? 'рецензию' : 'оценку'}!`,
				)

				invalidateRelatedQueries()
			},
			onError: (error: unknown) => {
				handleApiError(
					error,
					`Не удалось обновить ${isReview ? 'рецензию' : 'оценку'}.`,
				)
			},
		})

		/**
		 * Delete a review mutation
		 */
		const { mutateAsync: deleteAsync, isPending: isDeleting } = useMutation({
			mutationFn: (id: string) => ReviewAPI.delete(id),
			onSuccess: () => {
				notificationStore.addSuccessNotification(
					`Вы успешно удалили ${isReview ? 'рецензию' : 'оценку'}!`,
				)
				setDefaultValues(null)

				invalidateRelatedQueries()
			},
			onError: (error: unknown) => {
				handleApiError(
					error,
					`Не удалось удалить ${isReview ? 'рецензию' : 'оценку'}.`,
				)
			},
		})

		/** EFFECTS */
		useEffect(() => {
			setTotal(
				calculateTotalReviewMark({
					rhymes,
					structure,
					realization,
					individuality,
					atmosphere,
				}),
			)
		}, [rhymes, structure, realization, individuality, atmosphere])

		useEffect(() => {
			setDefaultValues(userReview || null)
		}, [userReview])

		/**
		 * Set default values for the review form
		 *
		 * @param {Review | null} review - The review object or null
		 */
		const setDefaultValues = (review: Review | null) => {
			setTitle(review?.title ?? '')
			setText(review?.text ?? '')
			setRhymes(review?.values.rhymes ?? 5)
			setStructure(review?.values.structure ?? 5)
			setRealization(review?.values.realization ?? 5)
			setIndividuality(review?.values.individuality ?? 5)
			setAtmosphere(review?.values.atmosphere ?? 1)
		}

		/**
		 * Check if there are changes in the form compared to the user's existing review
		 *
		 * @returns {boolean} - True if there are changes, false otherwise
		 */
		const hasChanges = useMemo(() => {
			if (userReview) {
				const valuesChanged =
					rhymes !== userReview.values.rhymes ||
					structure !== userReview.values.structure ||
					realization !== userReview.values.realization ||
					individuality !== userReview.values.individuality ||
					atmosphere !== userReview.values.atmosphere

				if (isReview) {
					return (
						title !== userReview.title ||
						text !== userReview.text ||
						valuesChanged
					)
				} else {
					return valuesChanged
				}
			}
			return true
		}, [
			atmosphere,
			individuality,
			isReview,
			realization,
			rhymes,
			structure,
			text,
			title,
			userReview,
		])

		/**
		 * Check if the form is valid
		 *
		 * @returns {boolean} - True if the form is valid, false otherwise
		 */
		const isFormValid = useMemo(() => {
			if (!isReview) return true
			return (
				title.trim().length <= constraints.review.maxTitleLength &&
				title.trim().length >= constraints.review.minTitleLength &&
				text.trim().length >= constraints.review.minTextLength &&
				text.trim().length <= constraints.review.maxTextLength
			)
		}, [isReview, text, title])

		/**
		 * Check if both text and title are filled when isReview is true
		 *
		 * @returns {boolean} - True if both text and title are filled, false otherwise
		 */
		const textAndTitleTogether = useMemo(() => {
			if (!isReview) return true
			return text.trim() !== '' && title.trim() !== ''
		}, [isReview, text, title])

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
		 * Handle form submission
		 */
		const handleSubmit = async () => {
			if (!checkAuth() || !isFormValid || !hasChanges || isSubmitting) return

			const reviewData = {
				title: isReview ? title.trim() || undefined : undefined,
				text: isReview ? text.trim() || undefined : undefined,
				rhymes,
				structure,
				realization,
				individuality,
				atmosphere,
			}

			if (userReview) {
				return updateAsync({
					id: userReview.id,
					data: reviewData,
				})
			} else {
				return createAsync({ ...reviewData, releaseId })
			}
		}

		/**
		 * Handle review deletion
		 */
		const deleteReview = async () => {
			if (!checkAuth() || !userReview || isSubmitting) return

			return deleteAsync(userReview.id)
		}

		return (
			<div className='border bg-zinc-900 rounded-xl p-2 border-white/10 grid gap-y-4 lg:gap-y-5'>
				{userReview && (
					<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 font-medium'>
						Вы уже оставляли
						{userReview.title && userReview.text ? ' рецензию ' : ' оценку '}к
						данной работе. Вы можете изменить ее, заполнив форму ниже!
					</div>
				)}

				<div className='border bg-zinc-900 rounded-xl p-2 border-white/10 grid gap-y-4 lg:gap-y-5'>
					{userReview && (
						<div className='ml-auto sm:max-w-50 max-sm:w-full justify-end'>
							<ReleaseDetailsEstimationDeleteButton
								title={`Удалить ${
									userReview.title && userReview.text ? ' рецензию' : ' оценку'
								}`}
								disabled={!userReview || isSubmitting}
								isLoading={isDeleting}
								onClick={deleteReview}
							/>
						</div>
					)}

					<ReleaseDetailsReviewFormMarks
						rhymes={rhymes}
						setRhymes={setRhymes}
						structure={structure}
						setStructure={setStructure}
						realization={realization}
						setRealization={setRealization}
						individuality={individuality}
						setIndividuality={setIndividuality}
						atmosphere={atmosphere}
						setAtmosphere={setAtmosphere}
					/>

					<ReleaseDetailsReviewFormText
						isReview={isReview}
						title={title}
						setTitle={setTitle}
						text={text}
						setText={setText}
					/>

					<div className='flex items-center space-x-10 justify-end'>
						<div className='relative'>
							<span className='font-bold text-4xl lg:text-5xl'>{total}</span>
							<span className='absolute top-1 text-sm w-7 text-zinc-400 font-semibold'>
								/ 90
							</span>
						</div>

						<button
							disabled={
								isDeleting ||
								!hasChanges ||
								!isFormValid ||
								!textAndTitleTogether
							}
							onClick={handleSubmit}
							className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
								isSubmitting ||
								!isFormValid ||
								!hasChanges ||
								!textAndTitleTogether
									? 'bg-white/60 pointer-events-none'
									: 'cursor-pointer hover:bg-white/70 bg-white'
							}`}
						>
							{isUpdating || isCreating ? (
								<Loader className={'size-8'} />
							) : (
								<TickSvg className='size-8' />
							)}
						</button>
					</div>
				</div>
			</div>
		)
	},
)

export default ReleaseDetailsReviewForm
