import { FC } from 'react'
import { ISvgProps } from '../../../models/svg/svg-props'

const MessageCircleSvg: FC<ISvgProps> = ({ className }) => {
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
					d='M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21H3.00463C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3M20.1213 3.87868C21.2929 5.05025 21.2929 6.94975 20.1213 8.12132C18.9497 9.29289 17.0503 9.29289 15.8787 8.12132C14.7071 6.94975 14.7071 5.05025 15.8787 3.87868C17.0503 2.70711 18.9497 2.70711 20.1213 3.87868Z'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				></path>
			</g>
		</svg>
	)
}

export default MessageCircleSvg
