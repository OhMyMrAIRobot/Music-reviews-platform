/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, useEffect, useMemo, useState } from 'react'
import { ReviewAPI } from '../../../../../../api/review/review-api'
import TickSvg from '../../../../../../components/svg/Tick-svg'
import Loader from '../../../../../../components/utils/Loader'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useStore } from '../../../../../../hooks/use-store'
import { IUserReview } from '../../../../../../models/review/user-review'
import { leaderboardKeys } from '../../../../../../query-keys/leaderboard-keys'
import { platformStatsKeys } from '../../../../../../query-keys/platform-stats-keys'
import { profileKeys } from '../../../../../../query-keys/profile-keys'
import { releaseDetailsKeys } from '../../../../../../query-keys/release-details-keys'
import { releasesKeys } from '../../../../../../query-keys/releases-keys'
import { reviewsKeys } from '../../../../../../query-keys/reviews-keys'
import authStore from '../../../../../../stores/auth-store'
import { calculateTotalReviewMark } from '../../../../../../utils/calculate-total-review-mark'
import ReleaseDetailsEstimationDeleteButton from '../../buttons/Release-details-estimation-delete-button'
import ReleaseDetailsReviewFormMarks from './Release-details-review-form-marks'
import ReleaseDetailsReviewFormText from './Release-details-review-form-text'

interface IProps {
	isReview: boolean
	releaseId: string
}

const ReleaseDetailsReviewForm: FC<IProps> = ({ isReview, releaseId }) => {
	const { notificationStore } = useStore()

	const { checkAuth } = useAuth()
	const queryClient = useQueryClient()

	const { data: userReview } = useQuery({
		queryKey: releaseDetailsKeys.userReview(releaseId),
		queryFn: () => ReviewAPI.fetchUserReview(releaseId),
		enabled: authStore.isAuth,
		staleTime: 1000 * 60 * 5,
		retry: false,
	})

	const invalidateRelatedQueries = () => {
		const keys = [
			releaseDetailsKeys.details(releaseId),
			releaseDetailsKeys.userReview(releaseId),
			reviewsKeys.all,
			releasesKeys.all,
			profileKeys.profile(authStore.user?.id || 'unknown'),
			platformStatsKeys.all,
			leaderboardKeys.all,
		]
		keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }))

		queryClient.invalidateQueries({
			queryKey: ['releaseDetails', 'reviews'],
			predicate: query =>
				(query.queryKey[2] as { releaseId: string } | undefined)?.releaseId ===
				releaseId,
		})
	}

	const createMutation = useMutation({
		mutationFn: (data: {
			title?: string
			text?: string
			rhymes: number
			structure: number
			realization: number
			individuality: number
			atmosphere: number
		}) => ReviewAPI.postReview(releaseId, data),
		onSuccess: invalidateRelatedQueries,
	})

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string
			data: {
				title?: string
				text?: string
				rhymes: number
				structure: number
				realization: number
				individuality: number
				atmosphere: number
			}
		}) => ReviewAPI.updateReview(id, data),
		onSuccess: invalidateRelatedQueries,
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => ReviewAPI.deleteReview(id),
		onSuccess: invalidateRelatedQueries,
	})

	const [title, setTitle] = useState<string>('')
	const [text, setText] = useState<string>('')
	const [rhymes, setRhymes] = useState<number>(5)
	const [structure, setStructure] = useState<number>(5)
	const [realization, setRealization] = useState<number>(5)
	const [individuality, setIndividuality] = useState<number>(5)
	const [atmosphere, setAtmosphere] = useState<number>(1)
	const [total, setTotal] = useState<number>(28)

	useEffect(() => {
		setTotal(
			calculateTotalReviewMark({
				rhymes,
				structure,
				realization,
				individuality,
				atmosphere,
			})
		)
	}, [rhymes, structure, realization, individuality, atmosphere])

	useEffect(() => {
		setDefaultValues(userReview || null)
	}, [userReview])

	const setDefaultValues = (review: IUserReview | null) => {
		setTitle(review?.title ?? '')
		setText(review?.text ?? '')
		setRhymes(review?.rhymes ?? 5)
		setStructure(review?.structure ?? 5)
		setRealization(review?.realization ?? 5)
		setIndividuality(review?.individuality ?? 5)
		setAtmosphere(review?.atmosphere ?? 1)
	}

	const hasChanges = useMemo(() => {
		if (userReview) {
			if (isReview) {
				return (
					title !== userReview.title ||
					text !== userReview.text ||
					rhymes !== userReview.rhymes ||
					structure !== userReview.structure ||
					realization !== userReview.realization ||
					individuality !== userReview.individuality ||
					atmosphere !== userReview.atmosphere
				)
			} else {
				return (
					rhymes !== userReview.rhymes ||
					structure !== userReview.structure ||
					realization !== userReview.realization ||
					individuality !== userReview.individuality ||
					atmosphere !== userReview.atmosphere
				)
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

	const isFormValid = useMemo(() => {
		return (
			title.trim().length <= 100 &&
			title.trim().length >= 5 &&
			text.trim().length >= 300
		)
	}, [text, title])

	const textAndTitleTogether = useMemo(() => {
		if (!isReview) return true
		return text.trim() !== '' && title.trim() !== ''
	}, [isReview, text, title])

	const postReview = async () => {
		if (
			!checkAuth() ||
			createMutation.isPending ||
			!isFormValid ||
			!hasChanges ||
			updateMutation.isPending ||
			deleteMutation.isPending
		)
			return

		try {
			if (userReview) {
				await updateMutation.mutateAsync({
					id: userReview.id,
					data: {
						title: isReview ? title.trim() || undefined : undefined,
						text: isReview ? text.trim() || undefined : undefined,
						rhymes,
						structure,
						realization,
						individuality,
						atmosphere,
					},
				})
			} else {
				await createMutation.mutateAsync({
					title: isReview ? title.trim() || undefined : undefined,
					text: isReview ? text.trim() || undefined : undefined,
					rhymes,
					structure,
					realization,
					individuality,
					atmosphere,
				})
			}

			notificationStore.addSuccessNotification(
				`Вы успешно ${userReview ? 'обновили' : 'добавили'} ${
					isReview ? 'рецензию' : 'оценку'
				}!`
			)
		} catch (error: unknown) {
			const errors = Array.isArray((error as any).response?.data?.message)
				? (error as any).response?.data?.message
				: [(error as any).response?.data?.message]
			errors.forEach((err: string) =>
				notificationStore.addErrorNotification(err)
			)
		}
	}

	const deleteReview = async () => {
		if (
			!checkAuth() ||
			!userReview ||
			deleteMutation.isPending ||
			createMutation.isPending ||
			updateMutation.isPending
		)
			return

		try {
			await deleteMutation.mutateAsync(userReview.id)
			notificationStore.addSuccessNotification(
				`Вы успешно удалили ${
					userReview.title && userReview.text ? ' рецензию' : ' оценку'
				}!`
			)
			setDefaultValues(null)
		} catch (error: unknown) {
			const errors = Array.isArray((error as any).response?.data?.message)
				? (error as any).response?.data?.message
				: [(error as any).response?.data?.message]
			errors.forEach((err: string) =>
				notificationStore.addErrorNotification(err)
			)
		}
	}

	return (
		<div className='border bg-zinc-900 rounded-xl p-2 border-white/10 grid gap-y-4 lg:gap-y-5'>
			{userReview && (
				<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
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
							disabled={
								!userReview ||
								createMutation.isPending ||
								updateMutation.isPending ||
								deleteMutation.isPending
							}
							isLoading={deleteMutation.isPending}
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
							deleteMutation.isPending || !hasChanges || !textAndTitleTogether
						}
						onClick={postReview}
						className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
							deleteMutation.isPending ||
							updateMutation.isPending ||
							createMutation.isPending ||
							!hasChanges ||
							!textAndTitleTogether
								? 'bg-white/60 pointer-events-none'
								: 'cursor-pointer hover:bg-white/70 bg-white'
						}`}
					>
						{updateMutation.isPending || createMutation.isPending ? (
							<Loader className={'size-8'} />
						) : (
							<TickSvg className='size-8' />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ReleaseDetailsReviewForm
