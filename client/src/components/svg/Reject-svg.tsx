import { FC } from 'react'
import { ISvgProps } from '../../models/svg/svg-props'

const RejectSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			fill='currentColor'
			viewBox='0 0 64 64'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<rect x='-256' y='-256' />
			<path d='M32.266,7.951c13.246,0 24,10.754 24,24c0,13.246 -10.754,24 -24,24c-13.246,0 -24,-10.754 -24,-24c0,-13.246 10.754,-24 24,-24Zm-15.616,11.465c-2.759,3.433 -4.411,7.792 -4.411,12.535c0,11.053 8.974,20.027 20.027,20.027c4.743,0 9.102,-1.652 12.534,-4.411l-28.15,-28.151Zm31.048,25.295c2.87,-3.466 4.596,-7.913 4.596,-12.76c0,-11.054 -8.974,-20.028 -20.028,-20.028c-4.847,0 -9.294,1.726 -12.76,4.596l28.192,28.192Z'></path>
		</svg>
	)
}

export default RejectSvg
