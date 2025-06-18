import { FC } from 'react'

interface IProps {
	title: string
	onClick: () => void
	isActive: boolean
}

const SwitchButton: FC<IProps> = ({ title, onClick, isActive }) => {
	return (
		<button
			onClick={onClick}
			className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm h-12 w-full font-semibold transition-colors duration-200
				${isActive ? 'bg-white text-black' : 'hover:bg-white/7 bg-zinc-900'}`}
		>
			{title}
		</button>
	)
}

export default SwitchButton
