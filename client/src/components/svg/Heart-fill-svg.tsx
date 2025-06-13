import { FC } from 'react'
import { ISvgProps } from '../../models/svg/svg-props'

const HeartFillSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 27 25'
			fill='none'
			className={className}
		>
			<path
				d='M21.897 0H15.147L13.5 1.61672L11.853 0H5.103L0 4.99474V11.5273L13.5 25L27 11.5273V4.99474L21.897 0Z'
				fill='white'
			/>
		</svg>
	)
}

export default HeartFillSvg
