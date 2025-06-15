import { FC } from 'react'
import { ISvgProps } from '../../models/svg/svg-props'

const PixelHeartSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			stroke='currentColor'
			fill='none'
			strokeWidth='0'
			viewBox='0 0 20 20'
			className={className}
		>
			<g clipPath='url(#clip0_4127_2080)'>
				<path
					d='M15.18 2.5L17.5 4.83V7.75L10 15.44L2.5 7.75V4.83L4.82 2.5H7.74L8.23 2.99L10.01 4.78L11.79 2.99L12.28 2.5H15.2M16.24 0H11.24L10.02 1.23L8.8 0H3.78L0 3.8V8.77L10 19.02L20 8.77V3.8L16.22 0H16.24Z'
					fill='currentColor'
					stroke='currentColor'
				></path>
			</g>
			<defs>
				<clipPath id='clip0_4127_2080'>
					<rect width='20' height='19.02' fill='white'></rect>
				</clipPath>
			</defs>
		</svg>
	)
}

export default PixelHeartSvg
