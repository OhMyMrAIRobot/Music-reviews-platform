import { FC } from 'react'
import { ISvgProps } from '../../models/svg/svg-props'

const TickRoundedSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<path
				d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>
			<path
				d='M7.75 12L10.58 14.83L16.25 9.17004'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			></path>
		</svg>
	)
}

export default TickRoundedSvg
