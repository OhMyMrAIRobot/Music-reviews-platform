import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import TickSvg from '../../../../../../components/svg/Tick-svg'
import TrashSvg from '../../../../../../components/svg/Trash-svg'
import Loader from '../../../../../../components/utils/Loader'
import { useAuth } from '../../../../../../hooks/use-auth'
import { useLoading } from '../../../../../../hooks/use-loading'
import { useStore } from '../../../../../../hooks/use-store'
import { IUserReview } from '../../../../../../models/review/user-review'
import { calculateTotalReviewMark } from '../../../../../../utils/calculate-total-review-mark'
import ReleaseDetailsReviewFormMarks from './Release-details-review-form-marks'
import ReleaseDetailsReviewFormText from './Release-details-review-form-text'

interface IProps {
	isReview: boolean
	releaseId: string
	refetchReviews: () => void
}

const ReleaseDetailsReviewForm: FC<IProps> = observer(
	({ isReview, releaseId, refetchReviews }) => {
		const { releaseDetailsPageStore, notificationStore } = useStore()

		const { checkAuth } = useAuth()

		const userReview = releaseDetailsPageStore.userReview

		const [title, setTitle] = useState<string>('')
		const [text, setText] = useState<string>('')
		const [rhymes, setRhymes] = useState<number>(5)
		const [structure, setStructure] = useState<number>(5)
		const [realization, setRealization] = useState<number>(5)
		const [individuality, setIndividuality] = useState<number>(5)
		const [atmosphere, setAtmosphere] = useState<number>(1)
		const [total, setTotal] = useState<number>(28)

		const { execute: handleDelete, isLoading: isDeleting } = useLoading(
			releaseDetailsPageStore.deleteReview
		)
		const { execute: handleUpdate, isLoading: isUpdating } = useLoading(
			releaseDetailsPageStore.updateReview
		)
		const { execute: handlePost, isLoading: isPosting } = useLoading(
			releaseDetailsPageStore.postReview
		)

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
			setDefaultValues(userReview)
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

		const textAndTitleTogether = useMemo(() => {
			if (!isReview) return true
			return text.trim() !== '' && title.trim() !== ''
		}, [isReview, text, title])

		const postReview = async () => {
			if (!checkAuth() || isDeleting || isPosting || isUpdating) return

			const promise = userReview
				? handleUpdate(releaseId, userReview.id, {
						title: isReview ? title.trim() || undefined : undefined,
						text: isReview ? text.trim() || undefined : undefined,
						rhymes,
						structure,
						realization,
						individuality,
						atmosphere,
				  })
				: handlePost(releaseId, {
						title: isReview ? title.trim() || undefined : undefined,
						text: isReview ? text.trim() || undefined : undefined,
						rhymes,
						structure,
						realization,
						individuality,
						atmosphere,
				  })

			const errors = await promise

			if (errors.length === 0) {
				notificationStore.addSuccessNotification(
					`Вы успешно ${userReview ? 'обновили' : 'добавили'} ${
						isReview ? 'рецензию' : 'оценку'
					}!`
				)
				refetchReviews()
			} else {
				errors.forEach(error => {
					notificationStore.addErrorNotification(error)
				})
			}
		}

		const deleteReview = async () => {
			if (!checkAuth() || !userReview || isDeleting) return
			const errors = await handleDelete(userReview.id, releaseId)

			if (errors.length === 0) {
				notificationStore.addSuccessNotification(
					`Вы успешно удалили ${
						userReview.title && userReview.text ? ' рецензию' : ' оценку'
					}!`
				)
				refetchReviews()
				setDefaultValues(null)
			} else {
				errors.forEach(err => notificationStore.addErrorNotification(err))
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
						<div className='flex justify-end'>
							<button
								onClick={deleteReview}
								disabled={isDeleting || isUpdating}
								className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-white/5 hover:bg-red-500 text-white h-10 px-6 py-2 space-x-2 text-xs lg:text-sm cursor-pointer transition-colors duration-200 ${
									isDeleting || isUpdating
										? 'opacity-60 pointer-events-none'
										: ''
								}`}
							>
								{isDeleting ? (
									<Loader className={'size-4'} />
								) : (
									<TrashSvg className='size-4' />
								)}

								<span>
									Удалить
									{userReview.title && userReview.text
										? ' рецензию'
										: ' оценку'}
								</span>
							</button>
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
							disabled={isDeleting || !hasChanges || !textAndTitleTogether}
							onClick={postReview}
							className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
								isDeleting ||
								isUpdating ||
								isPosting ||
								!hasChanges ||
								!textAndTitleTogether
									? 'bg-white/60 pointer-events-none'
									: 'cursor-pointer hover:bg-white/70 bg-white'
							}`}
						>
							{isUpdating || isPosting ? (
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
)

export default ReleaseDetailsReviewForm
