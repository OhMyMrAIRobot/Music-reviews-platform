import { FC, ReactNode } from 'react'

interface IProps {
	onClick: () => void
	children: ReactNode
}

const AdminSvgButton: FC<IProps> = ({ onClick, children }) => {
	return (
		<button
			onClick={onClick}
			className='border border-white/15 size-8 flex items-center justify-center rounded-lg cursor-pointer text-white/70 hover:text-white hover:border-white/70 transition-colors duration-200'
		>
			{children}
		</button>
	)
}

export default AdminSvgButton
