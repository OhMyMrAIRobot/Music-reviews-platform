import { FC } from 'react'
import { ISvgProps } from '../../../../models/svg/svg-props'

const AuthorCommentSvg: FC<ISvgProps> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 140.12 140.12'
			className={className}
			aria-hidden='true'
			focusable='false'
		>
			<defs>
				<style>{`.hexagon-icon-path { fill: #fff; stroke-width: 0; }`}</style>
			</defs>
			<g>
				<path
					className='hexagon-icon-path'
					d='m69.77,140.12c-.79,0-1.58-.16-2.32-.47l-45.21-18.97c-1.47-.62-2.63-1.79-3.23-3.26L.45,72.04c-.6-1.47-.59-3.12.02-4.59L19.44,22.23c.62-1.47,1.79-2.63,3.26-3.23L68.08.45c1.47-.6,3.12-.59,4.59.02l45.21,18.97c1.47.62,2.63,1.79,3.23,3.26l18.56,45.38c.6,1.47.59,3.12-.02,4.59l-18.97,45.21c-.62,1.47-1.79,2.63-3.26,3.23l-45.38,18.56c-.73.3-1.5.45-2.27.45Zm-40.6-29.54l40.63,17.05,40.78-16.68,17.05-40.63-16.67-40.78-40.63-17.05L29.54,29.17l-17.05,40.63,16.67,40.78Z'
				/>
				<g>
					<rect
						className='hexagon-icon-path'
						x='40.41'
						y='47.76'
						width='59.29'
						height='16.89'
					/>
					<rect
						className='hexagon-icon-path'
						x='40.41'
						y='75.46'
						width='34.63'
						height='16.89'
					/>
				</g>
			</g>
		</svg>
	)
}

export default AuthorCommentSvg
