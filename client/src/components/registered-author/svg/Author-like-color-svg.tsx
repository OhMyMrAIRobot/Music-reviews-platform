import { FC } from 'react'
import { ISvgProps } from '../../../models/svg/svg-props'

const AuthorLikeColorSvg: FC<ISvgProps> = ({ className }) => {
	const gradientId = `paint0_linear_${Math.random().toString(36).substr(2, 9)}`

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 30 30'
			fill='none'
			className={className}
		>
			<path
				d='M25.6541 4.44193L15.0679 0L4.44193 4.34593L0 14.9321L4.34593 25.5581L14.9321 30L25.5581 25.6541L30 15.0679L25.6541 4.44193Z'
				fill={`url(#${gradientId})`}
			/>
			<path
				d='M20.4763 7.73438H15.8675L14.742 8.86933L13.6166 7.73438H9.00779L5.52441 11.2368V15.817L14.742 25.2678L23.9597 15.817V11.2368L20.4763 7.73438Z'
				fill='#F0F1F1'
			/>
			<path
				d='M13.6168 7.73438L12.1797 10.1399L14.7423 12.6644V8.86933L13.6168 7.73438Z'
				fill='#C7C5C8'
			/>
			<path
				d='M12.1795 10.1399H9.76445L9.00781 7.73438H13.6166L12.1795 10.1399Z'
				fill='#D4D1D1'
			/>
			<path
				d='M9.76443 10.1399L7.8538 12.11L5.52441 11.2368L9.00779 7.73438L9.76443 10.1399Z'
				fill='#D7D5D6'
			/>
			<path
				d='M7.8538 12.1115V14.4599L5.52441 15.8185V11.2383L7.8538 12.1115Z'
				fill='#E8E8E9'
			/>
			<path
				d='M7.8538 14.459L14.742 21.4067V25.2684L5.52441 15.8176L7.8538 14.459Z'
				fill='#E6E6E6'
			/>
			<path
				d='M15.8681 7.73438L17.3029 10.1399L14.7427 12.6644V8.86933L15.8681 7.73438Z'
				fill='#DDDCDC'
			/>
			<path
				d='M17.3024 10.1399H19.7199L20.4765 7.73438H15.8677L17.3024 10.1399Z'
				fill='#D0CFD0'
			/>
			<path
				d='M19.7197 10.1399L21.6303 12.11L23.9597 11.2368L20.4764 7.73438L19.7197 10.1399Z'
				fill='#C6C4C8'
			/>
			<path
				d='M21.6304 12.1115V14.4599L23.9598 15.8185V11.2383L21.6304 12.1115Z'
				fill='#E9E8EC'
			/>
			<path
				d='M21.6309 14.459L14.7427 21.4067V25.2684L23.9603 15.8176L21.6309 14.459Z'
				fill='#D9DADC'
			/>
			<defs>
				<linearGradient
					id={gradientId}
					x1='15'
					y1='1.01858'
					x2='15'
					y2='28.8105'
					gradientUnits='userSpaceOnUse'
				>
					<stop stopColor='#D4121A' />
					<stop offset='0.71' stopColor='#891813' />
					<stop offset='1' stopColor='#831812' />
				</linearGradient>
			</defs>
		</svg>
	)
}

export default AuthorLikeColorSvg
