import { FC } from 'react'
import { ISvgProps } from '../../../../models/svg/svg-props'

const LeaderboardSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			data-name='Layer 2'
			viewBox='0 0 21.61 17.92'
			className={className}
			strokeWidth='0'
		>
			<g>
				<g>
					<path d='m6.74,0l3.22,3.47v10.98s-3.22,3.47-3.22,3.47h-3.52s-3.22-3.47-3.22-3.47v-2.4h3.47s-.25,2.4-.25,2.4h3.03s0-3.8,0-3.8h-3.03S0,7.43,0,7.43v-3.96S3.22,0,3.22,0h3.52Zm-.5,7.43v-3.96s-2.53,0-2.53,0v3.96s2.53,0,2.53,0Z' />
					<path d='m15.42,17.92l-3.72-3.47V3.47S15.42,0,15.42,0h2.48s3.72,3.47,3.72,3.47v10.98s-3.72,3.47-3.72,3.47h-2.48Zm0-14.45v10.98s2.48,0,2.48,0V3.47s-2.48,0-2.48,0Z' />
				</g>
			</g>
		</svg>
	)
}

export default LeaderboardSvg
