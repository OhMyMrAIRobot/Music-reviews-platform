import { FC } from 'react'
import { ISvgProps } from '../../../models/svg/svg-props'

const NoTextReviewSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			stroke='currentColor'
			fill='currentColor'
			strokeWidth='0'
			viewBox='0 0 24 24'
			className={className}
			height='1em'
			width='1em'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path d='M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z'></path>
		</svg>
	)
}

export default NoTextReviewSvg
