import { FC } from 'react'
import HeartSvg from '../svg/Heart-svg'

interface IProps {
	onClick: () => void
	isLiked: boolean
	className?: string
}

const ToggleFavButton: FC<IProps> = ({ onClick, isLiked, className }) => {
	return (
		<button
			onClick={onClick}
			className={`cursor-pointer inline-flex items-center justify-center border border-white/20 bg-zinc-950 rounded-full ${className}`}
		>
			<HeartSvg
				className={`size-6 ${
					isLiked ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-white'
				}`}
			/>
		</button>
	)
}

export default ToggleFavButton
