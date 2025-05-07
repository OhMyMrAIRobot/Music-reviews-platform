import { FC } from 'react'
import TooltipSpan from '../tooltip/TooltipSpan'

const ReviewToolTip: FC<{ text: string }> = ({ text }) => {
	return (
		<div
			className={`bg-primary border-2 border-gray-600 rounded-full text-white text-xs font-extrabold px-2 py-1 whitespace-nowrap`}
		>
			{text}
		</div>
	)
}

interface IProps {
	total: number
	rhymes: number
	structure: number
	realization: number
	individuality: number
	atmosphere: number
}

const ReviewMarks: FC<IProps> = ({
	total,
	rhymes,
	structure,
	realization,
	individuality,
	atmosphere,
}) => {
	return (
		<div className='flex flex-col h-full text-right justify-center'>
			<span className='text-[20px] lg:text-[24px] font-bold '>{total}</span>
			<div className='flex gap-x-1.5 font-bold text-sx lg:text-sm'>
				<TooltipSpan
					tooltip={<ReviewToolTip text='Рифмы / Образы' />}
					spanClassName='text-[rgba(35,101,199)] relative inline-block'
				>
					{rhymes}
				</TooltipSpan>
				<TooltipSpan
					tooltip={<ReviewToolTip text='Структура / Ритмика' />}
					spanClassName='text-[rgba(35,101,199)] relative inline-block'
				>
					{structure}
				</TooltipSpan>
				<TooltipSpan
					tooltip={<ReviewToolTip text='Реализация стиля' />}
					spanClassName='text-[rgba(35,101,199)] relative inline-block'
				>
					{realization}
				</TooltipSpan>
				<TooltipSpan
					tooltip={<ReviewToolTip text='Индивидуальность / Харизма' />}
					spanClassName='text-[rgba(35,101,199)] relative inline-block'
				>
					{individuality}
				</TooltipSpan>
				<TooltipSpan
					tooltip={<ReviewToolTip text='Атмосфера / Вайб' />}
					spanClassName='text-[rgba(160,80,222)] relative inline-block'
				>
					{atmosphere}
				</TooltipSpan>
			</div>
		</div>
	)
}

export default ReviewMarks
