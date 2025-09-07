import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import Slider from '../../../../../../components/utils/Slider'

interface IProps {
	value: number
	setValue: (val: number) => void
	title: string
	min: number
	max: number
	step: number
	valueTitle: string
	valueDescription: string | { title: string; text: string }[]
}

const ReleaseDetailsAlbumValueFormSlider: FC<IProps> = observer(
	({
		title,
		min,
		max,
		value,
		setValue,
		step,
		valueTitle,
		valueDescription,
	}) => {
		return (
			<div className='bg-zinc-800 rounded-lg px-5 py-1.5 lg:py-3 border border-zinc-700 text-center'>
				{/* HEADER */}
				<span className='text-sm grid lg:text-lg font-bold mb-0.5'>
					{title}
					<span className='ml-1 text-sm opacity-60'>
						(от {min} до {max})
					</span>
				</span>

				{/* SLIDER */}
				<div className='flex gap-3 w-full items-center h-[30px] mb-1'>
					<Slider
						value={value}
						onChange={setValue}
						max={max}
						min={min}
						step={step}
						trackBeforeColor='bg-gradient-to-br from-[rgba(86,118,234,.5)] to-[rgba(86,118,234,1)]'
					/>
					<div className='text-base md:text-[20px] font-bold text-right w-[25px] shrink-0'>
						{value}
					</div>
				</div>

				{/* TEXT */}
				<div className='text-xs font-medium lg:text-sm text-zinc-400 flex flex-col gap-2 mt-2'>
					{valueTitle && (
						<div className='font-bold text-white'>«{valueTitle}»</div>
					)}
					{typeof valueDescription === 'string' ? (
						<div>{valueDescription}</div>
					) : (
						<ul className='space-y-0.5 text-left'>
							{valueDescription.map(vd => (
								<li>
									<span className='text-white font-bold'>{vd.title}: </span>
									{vd.text}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		)
	}
)

export default ReleaseDetailsAlbumValueFormSlider
