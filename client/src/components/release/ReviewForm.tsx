import { FC, useState } from 'react'
import useCustomNavigate from '../../hooks/UseCustomNavigate'
import { useStore } from '../../hooks/UseStore'
import { PaintBrushSvgIcon, WarningSvgIcon } from '../svg/ReviewSvgIcons'

interface ISwitchButtonProps {
	title: string
	onClick: () => void
	isActive: boolean
}

const SwitchButton: FC<ISwitchButtonProps> = ({ title, onClick, isActive }) => {
	return (
		<button
			onClick={onClick}
			className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm h-12 w-full font-semibold transition-colors duration-300
				${isActive ? 'bg-white text-black' : 'hover:bg-white/7'}`}
		>
			{title}
		</button>
	)
}

const WarningAlert = () => {
	return (
		<div className='rounded-lg w-full border p-4 border-red-500/50 text-white bg-white/5 mt-5 flex gap-x-2.5'>
			<WarningSvgIcon />
			<div className='flex flex-col'>
				<h5 className='text-sm lg:text-base font-bold'>
					Ознакомьтесь с критериями.
				</h5>
				<span className='mt-1'>Будут удалены рецензии:</span>
				<ul className='list-disc list-inside marker:text-red-500'>
					<li>с матом</li>
					<li>с оскорблениями</li>
					<li>с рекламой и ссылками</li>
					<li>малосодержательные</li>
				</ul>
				<button className='items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 mt-2 bg-secondary cursor-pointer select-none'>
					Критерии оценки
				</button>
			</div>
		</div>
	)
}

const ReviewForm = () => {
	const { authStore } = useStore()
	const { navigateToLogin } = useCustomNavigate()
	const [isReview, setIsReview] = useState<boolean>(true)
	const [title, setTitle] = useState<string>('')
	const [text, setText] = useState<string>('')

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
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
							<div className='grid col-span-full px-5 pt-3 pb-5 w-full grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2 lg:gap-y-3 lg:gap-x-5 border border-[rgba(86,118,234)] bg-gradient-to-br from-[rgba(86,118,234)]/20 to-[rgba(86,118,234)]/5 rounded-xl'>
								123
							</div>
							<div className='col-span-full px-5 pt-3 pb-5 w-full rounded-xl border border-[rgba(160,80,222)] bg-gradient-to-br from-[rgba(160,80,222)]/20 to-[rgba(160,80,222)]/5'>
								456
							</div>
						</div>

						<div
							className={`flex flex-col mt-4 lg:mt-5 gap-2 transition-all duration-350 ease-in-out overflow-hidden ${
								isReview
									? 'opacity-100 translate-y-0'
									: 'opacity-0 max-h-0 -translate-y-5'
							}
							`}
						>
							<input
								type='text'
								value={title}
								onChange={e => setTitle(e.target.value)}
								placeholder='Заголовок рецензии (до 100 символов)'
								className='w-full border border-white/15 bg-primary px-3 py-2 text-base h-14 rounded-lg outline-none placeholder:text-sm lg:placeholder:text-base focus:border-white/85 transition-colors duration-200'
							/>
							<textarea
								value={text}
								onChange={e => setText(e.target.value)}
								placeholder='Текст рецензии (от 300 до 8500 символов)'
								className='min-h-35 max-h-125 w-full border border-white/15 bg-primary px-3 py-2 text-base h-14 rounded-lg outline-none placeholder:text-sm lg:placeholder:text-base focus:border-white/85 transition-colors duration-200'
							/>
							<div className='flex w-full justify-between'>
								<button
									onClick={() => {
										setTitle('')
										setText('')
									}}
									className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium bg-secondary text-white h-10 px-4 py-2 space-x-2 text-xs lg:text-sm w-50 cursor-pointer'
								>
									<PaintBrushSvgIcon />
									<span>Очистить черновик</span>
								</button>

								<div className='flex items-center justify-center text-sm bg-zinc-950 h-10 px-2 rounded-md font-semibold border border-white/15'>
									<span>{text.length}/8500</span>
								</div>
							</div>
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
