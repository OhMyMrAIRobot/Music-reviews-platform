import { FC } from 'react'
import { ISvgProps } from '../../../../models/svg/svg-props'

const ArrowBottomSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden='true'
		>
			<path d='m6 9 6 6 6-6'></path>
		</svg>
	)
}

export default ArrowBottomSvg
