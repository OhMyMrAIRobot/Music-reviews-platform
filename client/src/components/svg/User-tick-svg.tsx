import { FC } from 'react'
import { ISvgProps } from '../../models/svg/svg-props'

const UserTickSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<g strokeWidth='0'></g>
			<g strokeLinecap='round' strokeLinejoin='round'></g>
			<g>
				<path
					d='M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				></path>
			</g>
		</svg>
	)
}

export default UserTickSvg
