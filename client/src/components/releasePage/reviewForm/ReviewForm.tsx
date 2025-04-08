import { useEffect, useState } from 'react'
import useCustomNavigate from '../../../hooks/UseCustomNavigate'
import { useStore } from '../../../hooks/UseStore'
import SwitchButton from '../button/SwitchButton'
import WarningAlert from '../container/WarningAlert'
import { SendReviewSvgIcon } from '../releasePageSvgIcons'
import MarksReviewForm from './MarksReviewForm'
import TextReviewForm from './TextReviewForm'

const calculateTotalScore = (
	rhymes: number,
	structure: number,
	realization: number,
	individuality: number,
	atmosphere: number
): number => {
	const baseScore = rhymes + structure + realization + individuality

	const multipliedBaseScore = baseScore * 1.4

	const atmosphereMultiplier = 1 + (atmosphere - 1) * 0.06747

	return Math.round(multipliedBaseScore * atmosphereMultiplier)
}

const ReviewForm = () => {
	const { authStore } = useStore()
	const { navigateToLogin } = useCustomNavigate()
	const [isReview, setIsReview] = useState<boolean>(true)

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
			calculateTotalScore(
				rhymes,
				structure,
				realization,
				individuality,
				atmosphere
			)
		)
	}, [rhymes, structure, realization, individuality, atmosphere])

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
					<div className='border bg-zinc-900 rounded-xl p-2 border-white/10'>
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
							<button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-full size-16 bg-white text-black cursor-pointer hover:bg-white/50 transition-colors duration-300'>
								<SendReviewSvgIcon />
							</button>
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

export default ReviewForm
