import { FC } from 'react'

interface IProps {
	title: string
	isActive: boolean
	onClick: () => void
}

const AdminFilterButton: FC<IProps> = ({ title, isActive, onClick }) => {
	return (
		<button
			className={`font-medium text-sm cursor-pointer px-2 py-1 transition-all duration-200 relative select-none ${
				isActive ? 'text-white' : 'hover:text-white'
			}`}
			onClick={onClick}
		>
			<span className='px-2'>{title}</span>
			<div
				className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
					isActive ? 'bg-white' : 'bg-transparent'
				}`}
			/>
		</button>
	)
}

export default AdminFilterButton
