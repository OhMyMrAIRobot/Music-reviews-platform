import { FC, ReactNode } from 'react'

interface IProps {
	title: string
	onClick: () => void
	svg: ReactNode
	disabled: boolean
}

const EditUserModalButton: FC<IProps> = ({ title, onClick, svg, disabled }) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`h-8 px-3 text-sm font-medium border border-white/10 rounded-lg flex items-center justify-center gap-1 text-white/90  transition-all duration-200 ${
				disabled
					? 'cursor-not-allowed opacity-70'
					: 'hover:text-white hover:bg-white/5 hover:border-white/15 cursor-pointer'
			}`}
		>
			{svg}
			<span>{title}</span>
		</button>
	)
}

export default EditUserModalButton
