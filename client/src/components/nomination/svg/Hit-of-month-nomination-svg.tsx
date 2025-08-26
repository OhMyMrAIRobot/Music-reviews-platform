import { FC } from 'react'
import { ISvgProps } from '../../../models/svg/svg-props'

const HitOfMonthNominationSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 15 23'
			width={20}
			height={20}
			fill='none'
			className={className}
		>
			<path
				d='M15 5.1159V0.925453C15 0.303003 14.448 -0.108216 13.8 0.0251421L7.42801 1.30338C6.61199 1.47013 6.16798 1.87025 6.16798 2.53718L6.24002 14.8972C6.24002 15.4085 5.98801 15.742 5.49603 15.8309L3.588 16.2088C1.13997 16.6757 0 17.8428 0 19.5434C0 21.2773 1.45198 22.5 3.47997 22.5C5.256 22.5 7.94401 21.2662 7.94401 17.9984V7.82798C7.94401 7.27221 8.04001 7.17219 8.58002 7.07217L14.292 5.90505C14.724 5.81617 15 5.50493 15 5.1159Z'
				fill='white'
			/>
		</svg>
	)
}

export default HitOfMonthNominationSvg
