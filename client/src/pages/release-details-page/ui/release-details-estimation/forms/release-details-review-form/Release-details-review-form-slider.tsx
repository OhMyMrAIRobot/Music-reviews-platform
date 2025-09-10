import { FC } from 'react'
import Slider from '../../../../../../components/utils/Slider'

interface IProps {
	title: string
	value: number
	beforeColor: string
	afterColor: string
	onChange: (val: number) => void
}

const ReleaseDetailsReviewFormSlider: FC<IProps> = ({
	title,
	value,
	beforeColor,
	afterColor,
	onChange,
}) => {
	return (
		<div>
			<div className='flex w-full justify-between mb-1'>
				<span className='text-sm font-medium'>{title}</span>
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

export default ReleaseDetailsReviewFormSlider
