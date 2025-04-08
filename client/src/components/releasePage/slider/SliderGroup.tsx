import { FC } from 'react'
import Slider from './Slider'

interface ISliderGroupProps {
	title: string
	value: number
	onChange: (val: number) => void
	beforeColor: string
	afterColor: string
}

const SliderGroup: FC<ISliderGroupProps> = ({
	title,
	value,
	onChange,
	beforeColor,
	afterColor,
}) => {
	return (
		<div>
			<div className='flex w-full justify-between mb-1'>
				<span className='text-sm lg:text-base font-medium'>{title}</span>
				<span className='lg:text-xl font-bold'>{value}</span>
			</div>
			<Slider
				value={value}
				onChange={onChange}
				trackBeforeColor={beforeColor}
				trackAfterColor={afterColor}
				thumbImage={`${import.meta.env.VITE_SERVER_URL}/public/assets/rice.png`}
			/>
		</div>
	)
}

export default SliderGroup
