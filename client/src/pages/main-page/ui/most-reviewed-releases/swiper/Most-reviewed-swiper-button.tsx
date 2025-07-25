import { FC, ReactNode } from 'react'

interface IProps {
	disabled: boolean
	onClick: () => void
	children: ReactNode
}

const MostReviewedSwiperButton: FC<IProps> = ({
	disabled,
	onClick,
	children,
}) => {
	const handleClick = () => {
		if (!disabled) {
			onClick()
		}
	}

	return (
		<button
			disabled={disabled}
			onClick={handleClick}
			className={`relative rounded-full h-10 w-10 bg-zinc-950 flex items-center justify-center cursor-pointer transition-colors ${
				disabled ? 'opacity-30' : 'opacity-100 hover:bg-zinc-900 cursor-default'
			}`}
		>
			{children}
		</button>
	)
}

export default MostReviewedSwiperButton
