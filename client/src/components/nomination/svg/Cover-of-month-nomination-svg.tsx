import { FC } from 'react'
import { ISvgProps } from '../../../models/svg/svg-props'

const CoverOfMonthNominationSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='28'
			height='20'
			viewBox='0 0 28 20'
			fill='none'
			className={className}
		>
			<mask
				id='mask0_1332_1972'
				style={{ maskType: 'luminance' }}
				maskUnits='userSpaceOnUse'
				x='0'
				y='0'
				width='28'
				height='20'
			>
				<path d='M28 0H0V20H28V0Z' fill='white' />
			</mask>
			<g mask='url(#mask0_1332_1972)'>
				<path
					d='M20.1254 0L14.6338 0.00385618C13.6338 0.00320818 13.1338 0.00455426 12.6338 0.00437006L11.6338 0.00385618L8.14132 0H2.93332C2.41794 0 2 0.426476 2 0.952382V18.0952C2 18.6211 2.41794 19.0477 2.93332 19.0477H25.3334C25.8487 19.0477 26.2666 18.6211 26.2666 18.0952V0.952382C26.2666 0.426476 25.8487 0 25.3334 0H20.1254ZM13.4613 0.00206804L17.4746 0L10.6338 0.00352526L13.4613 0.00206804ZM24.4 17.1428H3.86666V1.90476H24.4V17.1428ZM9.46666 7.61905C8.4357 7.61905 7.6 6.76629 7.6 5.71429C7.6 4.66229 8.4357 3.80953 9.46666 3.80953C10.4976 3.80953 11.3333 4.66229 11.3333 5.71429C11.3333 6.76629 10.4976 7.61905 9.46666 7.61905ZM22.5334 15.2381H8.53332L11.3333 9.5238L13.6667 14.2857L17.8666 5.71429L22.5334 15.2381Z'
					fill='white'
				/>
			</g>
		</svg>
	)
}

export default CoverOfMonthNominationSvg
