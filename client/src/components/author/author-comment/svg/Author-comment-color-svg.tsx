import { FC } from 'react'
import { ISvgProps } from '../../../../models/svg/svg-props'

const AuthorCommentColorSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			id='Layer_2'
			data-name='Layer 2'
			viewBox='0 0 128.12 128.12'
			className={className}
		>
			<defs>
				<linearGradient
					id='linear-gradient'
					x1='64.06'
					y1='4.35'
					x2='64.06'
					y2='123.04'
					gradientUnits='userSpaceOnUse'
				>
					<stop offset='0' stopColor='#d4121a' />
					<stop offset='0.71' stopColor='#891813' />
					<stop offset='1' stopColor='#831812' />
				</linearGradient>
			</defs>
			<g id='Layer_1-2' data-name='Layer 1'>
				<polygon
					fill='url(#linear-gradient)'
					strokeWidth='0'
					points='109.56 18.97 64.35 0 18.97 18.56 0 63.77 18.56 109.15 63.77 128.12 109.15 109.56 128.12 64.35 109.56 18.97'
				/>
				<g id='Layer_1-2' data-name='Layer 1-2'>
					<rect
						fill='#f0f1f1'
						strokeWidth='0'
						x='32.38'
						y='40.23'
						width='63.35'
						height='18.05'
					/>
					<rect
						fill='#f0f1f1'
						strokeWidth='0'
						x='32.38'
						y='69.83'
						width='37'
						height='18.05'
					/>
				</g>
			</g>
		</svg>
	)
}

export default AuthorCommentColorSvg
