import { FC, useEffect, useState } from 'react'
import useCustomNavigate from '../../../hooks/use-custom-navigate'
import { useStore } from '../../../hooks/use-store'
import { IReleaseReview } from '../../../model/review/release-review'
import { IReviewData } from '../../../model/review/review-data'
import FormInfoContainer from '../../form-elements/Form-info-container'
import FormInfoField from '../../form-elements/Form-info-field'
import SwitchButton from '../button/SwitchButton'
import WarningAlert from '../container/WarningAlert'
import { TickSvgIcon, TrashSvgIcon } from '../releasePageSvgIcons'
import MarksReviewForm from './MarksReviewForm'
import TextReviewForm from './TextReviewForm'

const calculateTotalScore = (reviewData: IReviewData): number => {
	const baseScore =
		reviewData.rhymes +
		reviewData.structure +
		reviewData.realization +
		reviewData.individuality
	const multipliedBaseScore = baseScore * 1.4
	const atmosphereMultiplier = 1 + (reviewData.atmosphere - 1) * 0.06747
	return Math.round(multipliedBaseScore * atmosphereMultiplier)
}

interface IProps {
	id: string
	fetchReviews: () => Promise<void>
}

const SendReviewForm: FC<IProps> = ({ id, fetchReviews }) => {
	const { authStore, releasePageStore, notificationsStore } = useStore()

	const { navigateToLogin } = useCustomNavigate()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [errors, setErrors] = useState<string[]>()
	const [isReview, setIsReview] = useState<boolean>(true)
	const [title, setTitle] = useState<string>('')
	const [text, setText] = useState<string>('')
	const [rhymes, setRhymes] = useState<number>(5)
	const [structure, setStructure] = useState<number>(5)
	const [realization, setRealization] = useState<number>(5)
	const [individuality, setIndividuality] = useState<number>(5)
	const [atmosphere, setAtmosphere] = useState<number>(1)
	const [total, setTotal] = useState<number>(28)
	const [userRelease, setUserRelease] = useState<IReleaseReview | undefined>(
		undefined
	)

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
			calculateTotalScore({
				rhymes,
				structure,
				realization,
				individuality,
				atmosphere,
			})
		)
	}, [rhymes, structure, realization, individuality, atmosphere])

	useEffect(() => {
		setUserRelease(
			releasePageStore.releaseReviews?.find(
				entry => entry.user_id === authStore.user?.id
			)
		)
		setDefaultValues(userRelease)
	}, [authStore.user?.id, releasePageStore.releaseReviews, userRelease])

	const postReview = () => {
		if (id) {
			setErrors([])
			setIsLoading(true)
			const promise = userRelease
				? releasePageStore.updateReview(id, {
						title: isReview ? title : undefined,
						text: isReview ? text : undefined,
						rhymes,
						structure,
						realization,
						individuality,
						atmosphere,
				  })
				: releasePageStore.postReview(id, {
						title: isReview ? title : undefined,
						text: isReview ? text : undefined,
						rhymes,
						structure,
						realization,
						individuality,
						atmosphere,
				  })
			promise.then(result => {
				setErrors(result)
				setIsLoading(false)
				if (result.length === 0) {
					notificationsStore.addNotification({
						id: self.crypto.randomUUID(),
						text: `Вы успешно ${
							userRelease ? 'обновили' : 'добавили'
						} рецензию!`,
						isError: false,
					})
					releasePageStore.fetchReleaseDetails(id)
					fetchReviews()
				}
			})
		}
	}

	const deleteReview = () => {
		if (id) {
			releasePageStore.deleteReview(id).then(result => {
				notificationsStore.addNotification({
					id: self.crypto.randomUUID(),
					text: result.message,
					isError: false,
				})
				if (result.status === true) {
					setDefaultValues()
					releasePageStore.fetchReleaseDetails(id)
					fetchReviews()
				}
			})
		}
	}

	return authStore.isAuth ? (
		<div className='mt-10 mx-auto'>
			<h3 className='text-xl lg:text-2xl font-bold '>Оценить работу</h3>
			<div className='grid lg:grid-cols-8 items-start gap-5 mt-5'>
				<div className='lg:col-span-2'>
					<div className='rounded-md bg-secondary p-1 grid w-full items-stretch justify-stretch'>
						<SwitchButton
							title='Рецензия'
							isActive={isReview}
							onClick={() => setIsReview(!isReview)}
						/>
						<SwitchButton
							title='Оценка без рецензии'
							isActive={!isReview}
							onClick={() => setIsReview(!isReview)}
						/>
					</div>
					<WarningAlert />
				</div>
				<div className='lg:col-span-6'>
					{userRelease && (
						<div className='bg-gradient-to-br from-white/20 border border-white/5 rounded-lg text-sm lg:text-base text-center px-3 py-3 lg:py-5 mb-4 font-medium'>
							Вы уже оставляли{' '}
							{userRelease.title && userRelease.text ? 'рецензию' : 'оценку'} к
							данной работе. Вы можете изменить ее, заполнив форму ниже!
						</div>
					)}
					<div className='border bg-zinc-900 rounded-xl p-2 border-white/10'>
						{userRelease && (
							<div className='flex justify-end mb-4'>
								<button
									onClick={deleteReview}
									className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-white/5 hover:bg-red-500 text-white h-10 px-4 py-2 space-x-2 text-xs lg:text-sm w-50 cursor-pointer transition-colors duration-300'
								>
									<TrashSvgIcon />
									<span>
										Удалить{' '}
										{userRelease.title && userRelease.text
											? 'рецензию'
											: 'оценку'}
									</span>
								</button>
							</div>
						)}
						<MarksReviewForm
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
						<TextReviewForm
							isReview={isReview}
							title={title}
							setTitle={setTitle}
							text={text}
							setText={setText}
						/>
						<div className='mt-5 flex items-center space-x-10 justify-end'>
							<div className='relative'>
								<span className='font-bold text-4xl lg:text-5xl'>{total}</span>
								<span className='absolute top-1 text-sm w-7 text-zinc-400 font-semibold'>
									/ 90
								</span>
							</div>
							<button
								disabled={isLoading}
								onClick={postReview}
								className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 text-black transition-colors duration-300 ${
									isLoading
										? 'bg-white/40 cursor-not-allowed'
										: 'cursor-pointer hover:bg-white/50 bg-white'
								}`}
							>
								<TickSvgIcon className='size-8' />
							</button>
						</div>
						<div className='w-1/2'>
							{errors && (
								<FormInfoContainer>
									{errors.map(error => (
										<FormInfoField key={error} text={error} isError={true} />
									))}
								</FormInfoContainer>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className='text-center border font-medium border-white/15 bg-gradient-to-br from-white/10 rounded-2xl text-sm lg:text-base w-full lg:max-w-[800px] sm:max-w-[600px] px-5 py-5 mx-auto mt-7'>
			<span className='mr-1'>Для отправки рецензии вам необходимо</span>
			<button
				onClick={navigateToLogin}
				className='underline underline-offset-2 cursor-pointer'
			>
				войти в свой аккаунт!
			</button>
		</div>
	)
}

export default SendReviewForm
