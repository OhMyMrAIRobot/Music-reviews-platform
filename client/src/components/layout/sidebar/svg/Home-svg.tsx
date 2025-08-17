import { FC } from 'react'
import { ISvgProps } from '../../../../models/svg/svg-props'

const HomeSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			stroke='currentColor'
			fill='currentColor'
			strokeWidth='0'
			viewBox='0 0 24 24'
			className={className}
			xmlns='http://www.w3.org/2000/svg'
		>
			<path d='M12.97 2.59a1.5 1.5 0 0 0-1.94 0l-7.5 6.363A1.5 1.5 0 0 0 3 10.097V19.5A1.5 1.5 0 0 0 4.5 21h4.75a.75.75 0 0 0 .75-.75V14h4v6.25c0 .414.336.75.75.75h4.75a1.5 1.5 0 0 0 1.5-1.5v-9.403a1.5 1.5 0 0 0-.53-1.144l-7.5-6.363Z'></path>
		</svg>
	)
}

export default HomeSvg
