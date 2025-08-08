import { observer } from 'mobx-react-lite'
import { FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import SwitchButton from '../../../../components/buttons/Switch-button'
import TickSvg from '../../../../components/svg/Tick-svg'
import TrashSvg from '../../../../components/svg/Trash-svg'
import useNavigationPath from '../../../../hooks/use-navigation-path'
import { useStore } from '../../../../hooks/use-store'
import { IReleaseReview } from '../../../../models/review/release-review'
import { RolesEnum } from '../../../../models/role/roles-enum'
import { calculateTotalMark } from '../../../../utils/calculate-total-mark'
import SendMediaReviewForm from '../release-details-media/Send-media-review-form'
import SendReviewFormMarks from './send-review-form-marks/Send-review-form-marks'
import SendReviewFormText from './Send-review-form-text'
import SendReviewFormWarning from './Send-review-form-warning'

interface IProps {
	releaseId: string
	fetchReviews: () => Promise<void>
}

const SendReviewForm: FC<IProps> = observer(
	({ releaseId: id, fetchReviews }) => {
		const { authStore, releaseDetailsPageStore, notificationStore } = useStore()

		const { navigateToLogin } = useNavigationPath()

		const [isLoading, setIsLoading] = useState<boolean>(false)
		const [isReview, setIsReview] = useState<boolean>(true)
		const [title, setTitle] = useState<string>('')
		const [text, setText] = useState<string>('')
		const [rhymes, setRhymes] = useState<number>(5)
		const [structure, setStructure] = useState<number>(5)
		const [realization, setRealization] = useState<number>(5)
		const [individuality, setIndividuality] = useState<number>(5)
		const [atmosphere, setAtmosphere] = useState<number>(1)
		const [total, setTotal] = useState<number>(28)
		const [userReview, setUserReview] = useState<IReleaseReview | undefined>(
			undefined
		)
		const [isMediaReview, setIsMediaReview] = useState<boolean>(false)

		const setDefaultValues = (review?: IReleaseReview) => {
			setTitle(review?.title ?? '')
			setText(review?.text ?? '')
			setRhymes(review?.rhymes ?? 5)
			setStructure(review?.structure ?? 5)
			setRealization(review?.realization ?? 5)
			setIndividuality(review?.individuality ?? 5)
			setAtmosphere(review?.atmosphere ?? 1)
		}

		useEffect(() => {
			setTotal(
				calculateTotalMark({
					rhymes,
					structure,
					realization,
					individuality,
					atmosphere,
				})
			)
		}, [rhymes, structure, realization, individuality, atmosphere])

		useEffect(() => {
			setUserReview(
				releaseDetailsPageStore.releaseReviews?.find(
					entry => entry.userId === authStore.user?.id
				)
			)
			setDefaultValues(userReview)
		}, [authStore.user?.id, releaseDetailsPageStore.releaseReviews, userReview])

		const postReview = async () => {
			if (id) {
				setIsLoading(true)
				const promise = userReview
					? releaseDetailsPageStore.updateReview(id, userReview.id, {
							title: isReview ? title.trim() || undefined : undefined,
							text: isReview ? text.trim() || undefined : undefined,
							rhymes,
							structure,
							realization,
							individuality,
							atmosphere,
					  })
					: releaseDetailsPageStore.postReview(id, {
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
						`Вы успешно ${userReview ? 'обновили' : 'добавили'} рецензию!`
					)
				} else {
					errors.forEach(error => {
						notificationStore.addErrorNotification(error)
					})
				}
				setIsLoading(false)
				fetchReviews()
			}
		}

		const deleteReview = () => {
			if (userReview) {
				releaseDetailsPageStore.deleteReview(userReview.id).then(result => {
					notificationStore.addSuccessNotification(result.message)
					if (result.status === true) {
						setDefaultValues()
						releaseDetailsPageStore.fetchReleaseDetails(id)
						fetchReviews()
					}
				})
			}
		}

		const hasChanges = useMemo(() => {
			if (userReview) {
				return (
					title !== userReview.title ||
					text !== userReview.text ||
					rhymes !== userReview.rhymes ||
					structure !== userReview.structure ||
					realization !== userReview.realization ||
					individuality !== userReview.individuality ||
					atmosphere !== userReview.atmosphere
				)
			}
			return true
		}, [
			atmosphere,
			individuality,
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

		const userMediaReview = releaseDetailsPageStore.userReleaseMedia

		return authStore.isAuth ? (
			<div className='mt-10 mx-auto'>
				<h3 className='text-xl lg:text-2xl font-bold '>Оценить работу</h3>

				<div className='grid lg:grid-cols-8 items-start gap-5 mt-5'>
					<div className='lg:col-span-2'>
						<div className='rounded-md bg-secondary grid w-full items-stretch justify-stretch'>
							<SwitchButton
								title='Рецензия'
								isActive={isReview && !isMediaReview}
								onClick={() => {
									setIsReview(true)
									setIsMediaReview(false)
								}}
							/>

							<SwitchButton
								title='Оценка без рецензии'
								isActive={!isReview && !isMediaReview}
								onClick={() => {
									setIsReview(false)
									setIsMediaReview(false)
								}}
							/>

							{authStore.user?.role.role === RolesEnum.MEDIA && (
								<SwitchButton
									title='Медиарецензия'
									isActive={isMediaReview && !isReview}
									onClick={() => {
										setIsMediaReview(true)
										setIsReview(false)
									}}
								/>
							)}
						</div>

						<SendReviewFormWarning />
					</div>

					<div className='lg:col-span-6'>
						{userReview && !isMediaReview && (
							<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
								Вы уже оставляли
								{userReview.title && userReview.text
									? ' рецензию'
									: ' оценку'}{' '}
								к данной работе. Вы можете изменить ее, заполнив форму ниже!
							</div>
						)}

						{userMediaReview && isMediaReview && (
							<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
								Вы уже оставляли медиарецензию к данной работе. Вы можете
								изменить ее, заполнив форму ниже!
							</div>
						)}

						{!isMediaReview ? (
							<div className='border bg-zinc-900 rounded-xl p-2 border-white/10'>
								{userReview && (
									<div className='flex justify-end mb-4'>
										<button
											onClick={deleteReview}
											className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-white/5 hover:bg-red-500 text-white h-10 px-6 py-2 space-x-2 text-xs lg:text-sm cursor-pointer transition-colors duration-200'
										>
											<TrashSvg className='size-4' />
											<span>
												Удалить
												{userReview.title && userReview.text
													? ' рецензию'
													: ' оценку'}
											</span>
										</button>
									</div>
								)}

								<SendReviewFormMarks
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

								<SendReviewFormText
									isReview={isReview}
									title={title}
									setTitle={setTitle}
									text={text}
									setText={setText}
								/>
								<div className='mt-5 flex items-center space-x-10 justify-end'>
									<div className='relative'>
										<span className='font-bold text-4xl lg:text-5xl'>
											{total}
										</span>
										<span className='absolute top-1 text-sm w-7 text-zinc-400 font-semibold'>
											/ 90
										</span>
									</div>

									<button
										disabled={isLoading || !hasChanges || !textAndTitleTogether}
										onClick={postReview}
										className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-200 ${
											isLoading || !hasChanges || !textAndTitleTogether
												? 'bg-white/40 pointer-events-none'
												: 'cursor-pointer hover:bg-white/70 bg-white'
										}`}
									>
										<TickSvg className='size-8' />
									</button>
								</div>
							</div>
						) : (
							authStore.user?.role.role === RolesEnum.MEDIA && (
								<SendMediaReviewForm releaseId={id} />
							)
						)}
					</div>
				</div>
			</div>
		) : (
			<div className='text-center text-white/90 border font-medium border-white/15 bg-gradient-to-br from-white/10 rounded-2xl text-sm lg:text-base w-full lg:max-w-[800px] sm:max-w-[600px] px-5 py-5 mx-auto mt-7'>
				<span className='mr-1'>Для отправки рецензии вам необходимо</span>
				<Link
					to={navigateToLogin}
					className='underline underline-offset-4 cursor-pointer hover:text-white transition-colors duration-200'
				>
					войти в свой аккаунт!
				</Link>
			</div>
		)
	}
)

export default SendReviewForm
