import { FC } from 'react'

interface IProps {
	title: string
	onClick?: () => void
	isInvert: boolean
}

const HeaderButton: FC<IProps> = ({ onClick, isInvert, title }) => {
	const handleClick = () => {
		if (onClick) {
			onClick()
		}
	}

	return (
		<button
			onClick={handleClick}
			className={`px-6 h-10 text-center text-sm font-semibold rounded-md border border-white/10 cursor-pointer transition-colors duration-200 select-none ${
				isInvert
					? 'text-black bg-white hover:bg-white/85'
					: 'text-white bg-[#242527]/75 hover:bg-white/15'
			}`}
		>
			{title}
		</button>
	)
}

export default HeaderButton
