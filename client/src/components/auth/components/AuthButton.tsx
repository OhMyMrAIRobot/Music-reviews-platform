import { FC } from 'react'

interface IAuthButtonProps {
	title: string
	isInvert: boolean
	onClick: () => void
}

const AuthButton: FC<IAuthButtonProps> = ({ title, isInvert, onClick }) => {
	return (
		<button
			onClick={onClick}
			className={`border border-white/15 rounded-md text-sm px-4 py-2 h-10 font-medium cursor-pointer transition-colors select-none ${
				isInvert
					? 'bg-white text-[#09090b] hover:bg-white/80 '
					: 'bg-primary text-white hover:bg-white/10'
			}`}
		>
			{title}
		</button>
	)
}

export default AuthButton
