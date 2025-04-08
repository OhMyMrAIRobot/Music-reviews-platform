import { FC } from 'react'

interface ISwitchButtonProps {
	title: string
	onClick: () => void
	isActive: boolean
}

const SwitchButton: FC<ISwitchButtonProps> = ({ title, onClick, isActive }) => {
	return (
		<button
			onClick={onClick}
			className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm h-12 w-full font-semibold transition-colors duration-300
				${isActive ? 'bg-white text-black' : 'hover:bg-white/7'}`}
		>
			{title}
		</button>
	)
}

export default SwitchButton
