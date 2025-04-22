import { FC } from 'react'
import { PaintBrushSvgIcon } from '../releasePageSvgIcons'

interface IProps {
	isReview: boolean
	title: string
	setTitle: (val: string) => void
	text: string
	setText: (val: string) => void
}

const TextReviewForm: FC<IProps> = ({
	isReview,
	title,
	setTitle,
	text,
	setText,
}) => {
	return (
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
	)
}

export default TextReviewForm
