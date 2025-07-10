import { FC, ReactNode } from 'react'

interface IProps {
	title: string
	onClick: () => void
	svg: ReactNode
}

const EditUserModalButton: FC<IProps> = ({ title, onClick, svg }) => {
	return (
		<button
			onClick={onClick}
			className='h-8 px-3 text-sm font-medium border border-white/10 rounded-lg cursor-pointer flex items-center justify-center gap-1 text-white/90 hover:text-white hover:bg-white/5 hover:border-white/15 transition-all duration-200'
		>
			{svg}
			<span>{title}</span>
		</button>
	)
}

export default EditUserModalButton
